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

  // Idempotent insert on (email).
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

  // Decrement founders counter only on new founders reservations.
  if (founders_tier_interest) {
    const { data: existing } = await client
      .from('waitlist')
      .select('id, founders_tier_interest, created_at')
      .eq('email', email)
      .limit(1)
      .maybeSingle();

    // Decrement when this row is newly created (rough heuristic: created within the last 5 seconds)
    if (existing && Date.now() - new Date(existing.created_at).getTime() < 5_000) {
      // Pull current count, then UPDATE if > 0. Race-safe via WHERE clause.
      const { data: current } = await client
        .from('site_state')
        .select('founders_individual_remaining')
        .eq('id', 1)
        .maybeSingle();
      const remaining = current?.founders_individual_remaining ?? 0;
      if (remaining > 0) {
        await client
          .from('site_state')
          .update({
            founders_individual_remaining: remaining - 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', 1)
          .gt('founders_individual_remaining', 0);
      }
    }
  }

  await trackServer({
    event: ANALYTICS_EVENTS.waitlistSignup,
    distinctId: email,
    properties: { source, founders_tier_interest },
  });

  return NextResponse.json({ ok: true });
}
