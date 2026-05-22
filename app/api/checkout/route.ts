import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getServiceClient } from '@/lib/supabase/service';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';

const bodySchema = z.object({ interval: z.enum(['month', 'year']) });

const SUCCESS_URL = 'https://www.deskpilot.academy/dashboard?welcome=1';
const CANCEL_URL = 'https://www.deskpilot.academy/subscribe?canceled=1';

export async function POST(request: Request) {
  const stripe = getStripe();
  const service = getServiceClient();
  if (!stripe || !service) {
    return NextResponse.json({ error: 'Billing is not configured' }, { status: 503 });
  }

  // 1. Require an authenticated Supabase user.
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: 'Auth is not configured' }, { status: 503 });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  const { interval } = parsed.data;

  // 2. Resolve (or create) the Stripe customer, keyed to the Supabase user.
  const { data: profile, error: profileErr } = await service
    .from('profiles')
    .select('id, email, full_name, stripe_customer_id')
    .eq('id', user.id)
    .single();
  if (profileErr || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  let customerId: string | null = profile.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile.email ?? user.email ?? undefined,
      name: profile.full_name ?? undefined,
      metadata: { supabase_user_id: profile.id },
    });
    customerId = customer.id;
    await service.from('profiles').update({ stripe_customer_id: customerId }).eq('id', profile.id);
  }

  // 3. Founder availability decides which plan to charge.
  const { data: state } = await service
    .from('site_state')
    .select('founders_individual_remaining')
    .eq('id', 1)
    .maybeSingle();
  const foundersRemaining = state?.founders_individual_remaining ?? 0;
  const planSlug = foundersRemaining > 0 ? 'all-access-founding' : 'all-access';

  // 4. Resolve the Stripe price id from the plans row (never hardcode amounts).
  const { data: plan, error: planErr } = await service
    .from('plans')
    .select('id, slug, stripe_monthly_price_id, stripe_annual_price_id')
    .eq('slug', planSlug)
    .single();
  if (planErr || !plan) {
    return NextResponse.json({ error: 'Plan not found' }, { status: 500 });
  }
  const priceId = interval === 'year' ? plan.stripe_annual_price_id : plan.stripe_monthly_price_id;
  if (!priceId) {
    return NextResponse.json({ error: 'Price not configured for plan' }, { status: 500 });
  }

  // 5. Create the Checkout Session. supabase_user_id is threaded in BOTH
  //    client_reference_id and subscription_data.metadata — it is the only
  //    reliable Stripe -> Supabase map in the webhook.
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: profile.id,
    subscription_data: { metadata: { supabase_user_id: profile.id } },
    success_url: SUCCESS_URL,
    cancel_url: CANCEL_URL,
  });

  return NextResponse.json({ url: session.url });
}
