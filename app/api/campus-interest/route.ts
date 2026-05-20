import { NextResponse } from 'next/server';
import { campusInterestSchema } from '@/lib/validators';
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

  const parsed = campusInterestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  const { email, campus_slug } = parsed.data;

  const client = getServiceClient();
  if (!client) {
    console.log('[campus-interest] no service client configured — payload:', { email, campus_slug });
    return NextResponse.json({ ok: true, mode: 'logged' });
  }

  // unique(email, campus_slug) — duplicates resolve cleanly.
  const { error: insertErr } = await client
    .from('campus_interest')
    .upsert(
      { email, campus_slug },
      { onConflict: 'email,campus_slug', ignoreDuplicates: true },
    );

  if (insertErr) {
    console.error('[campus-interest] insert error', insertErr);
    return NextResponse.json({ error: 'Could not save interest' }, { status: 500 });
  }

  await trackServer({
    event: ANALYTICS_EVENTS.campusInterestSubmitted,
    distinctId: email,
    properties: { campus_slug },
  });

  return NextResponse.json({ ok: true });
}
