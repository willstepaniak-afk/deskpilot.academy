import { NextResponse } from 'next/server';
import { resourceSchema } from '@/lib/validators';
import { getServiceClient } from '@/lib/supabase';
import { trackServer } from '@/lib/analytics-server';
import { ANALYTICS_EVENTS } from '@/lib/analytics';

export const runtime = 'nodejs';

// In P1 every lead magnet ships in "notify me when available" mode. The card
// still captures interest so we can mail the resource the moment it lands —
// but no PDF is delivered, no placeholder file exists. Distinguishing these
// notify-me captures from future actual downloads is done via the `notes`
// column ("notify-me-state") so post-launch analytics can split the funnel.
const VALID_SLUGS = new Set([
  'fi-menu-cheatsheet',
  'objection-tree-pack',
  'desking-payment-grid',
  'compliance-quickref',
  'manager-1-1-template',
]);

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = resourceSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  const { email, resource_slug } = parsed.data;
  if (!VALID_SLUGS.has(resource_slug)) {
    return NextResponse.json({ error: 'Unknown resource' }, { status: 400 });
  }

  const client = getServiceClient();
  if (!client) {
    console.log('[lead-magnet] no service client configured — payload:', {
      email,
      resource_slug,
      state: 'notify-me-state',
    });
    return NextResponse.json({ ok: true, mode: 'logged' });
  }

  const { error: insertErr } = await client.from('lead_magnet_downloads').insert({
    email,
    resource_slug,
    notes: 'notify-me-state',
  });
  if (insertErr) {
    console.error('[lead-magnet] insert error', insertErr);
    return NextResponse.json({ error: 'Could not save request' }, { status: 500 });
  }

  await trackServer({
    event: ANALYTICS_EVENTS.leadMagnetRequested,
    distinctId: email,
    properties: { resource_slug, state: 'notify-me-state' },
  });

  return NextResponse.json({ ok: true });
}
