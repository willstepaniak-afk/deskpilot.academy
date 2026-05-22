'use server';

import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getServiceClient } from '@/lib/supabase/service';
import { getStripe } from '@/lib/stripe';

const RETURN_URL = 'https://www.deskpilot.academy/dashboard';

// Creates a Stripe Billing Portal session for the signed-in user and redirects
// to it. Invoked from a <form action={manageBilling}> button in the dashboard.
export async function manageBilling() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/dashboard');

  const service = getServiceClient();
  const stripe = getStripe();
  if (!service || !stripe) redirect('/dashboard?billing=unavailable');

  const { data: profile } = await service
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  // No customer yet -> nothing to manage; send them to subscribe.
  if (!profile?.stripe_customer_id) redirect('/subscribe');

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: RETURN_URL,
  });
  redirect(session.url);
}
