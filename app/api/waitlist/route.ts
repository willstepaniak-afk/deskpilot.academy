import { NextResponse } from 'next/server';
import { waitlistSchema } from '@/lib/validators';
import { getServiceClient } from '@/lib/supabase';
import { trackServer } from '@/lib/analytics-server';
import { ANALYTICS_EVENTS } from '@/lib/analytics';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = waitlistSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }
  const { email, source, founders_tier_interest } = parsed.data;

  const client = getServiceClient();
  if (!client) {
    console.log('[waitlist] no service client configured — payload:', { email, source, founders_tier_interest });
    return NextResponse.json({ ok: true, mode: 'logged' });
  }

  // Idempotent insert on (email). founders_tier_interest is stored as a marketing
  // signal ONLY — it must never touch the billing seat counter.
  // site_state.founders_individual_remaining has exactly ONE writer:
  // claim_founder_seat(), called from the Stripe webhook on a real PAID founder
  // subscription. A waitlist signup is interest, not a purchased seat.
  const { error: insertErr } = await client
    .from('waitlist')
    .upsert(
      { email, source, founders_tier_interest },
      { onConflict: 'email', ignoreDuplicates: true },
    );

  if (insertErr) {
    console.error('[waitlist] insert error', insertErr);
    return NextResponse.json({ error: 'Could not save signup' }, { status: 500 });
  }

  await trackServer({
    event: ANALYTICS_EVENTS.waitlistSignup,
    distinctId: email,
    properties: { source, founders_tier_interest },
  });

  return NextResponse.json({ ok: true });
}
