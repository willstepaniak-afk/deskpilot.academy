import { NextResponse } from 'next/server';
import { b2bInquirySchema } from '@/lib/validators';
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

  const parsed = b2bInquirySchema.safeParse(payload);
  if (!parsed.success) {
    // Honeypot violation lands here too — return generic error to avoid signal to bots.
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const data = parsed.data;

  // Honeypot tripped — silent 200, no write, no analytics.
  if (data.website && data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const client = getServiceClient();
  if (!client) {
    console.log('[inquiry] no service client configured — payload:', {
      ...data,
      message: data.message ? `[${data.message.length} chars]` : '',
    });
    return NextResponse.json({ ok: true, mode: 'logged' });
  }

  const { error: insertErr } = await client.from('b2b_inquiries').insert({
    email: data.email,
    full_name: data.full_name,
    dealer_group: data.dealer_group,
    role: data.role,
    rooftops: data.rooftops,
    estimated_seats: data.estimated_seats,
    message: data.message || null,
    source: data.source,
  });

  if (insertErr) {
    console.error('[inquiry] insert error', insertErr);
    return NextResponse.json({ error: 'Could not save inquiry' }, { status: 500 });
  }

  // Note: this endpoint does NOT decrement founders_b2b_remaining. A submitted
  // inquiry is not a closed deal — decrementing on form submission would let
  // anyone manufacture fake scarcity. Decrement manually via Supabase dashboard
  // (or P3 billing logic) when a B2B founder deal actually closes.

  await trackServer({
    event: ANALYTICS_EVENTS.dealerInquirySubmitted,
    distinctId: data.email,
    properties: {
      rooftops: data.rooftops,
      estimated_seats: data.estimated_seats,
      role: data.role,
    },
  });

  return NextResponse.json({ ok: true });
}
