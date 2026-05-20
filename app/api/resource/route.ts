import { NextResponse } from 'next/server';
import { resourceSchema } from '@/lib/validators';
import { getServiceClient } from '@/lib/supabase';
import { trackServer } from '@/lib/analytics-server';
import { ANALYTICS_EVENTS } from '@/lib/analytics';

export const runtime = 'nodejs';

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

  const downloadUrl = `/placeholders/${resource_slug}.pdf`;

  const client = getServiceClient();
  if (!client) {
    console.log('[resource] no service client configured — payload:', { email, resource_slug });
    return NextResponse.json({ ok: true, mode: 'logged', downloadUrl });
  }

  const { error: insertErr } = await client.from('resource_requests').insert({
    email,
    resource_slug,
  });
  if (insertErr) {
    console.error('[resource] insert error', insertErr);
    return NextResponse.json({ error: 'Could not save request' }, { status: 500 });
  }

  await trackServer({
    event: ANALYTICS_EVENTS.leadMagnetRequested,
    distinctId: email,
    properties: { resource_slug },
  });

  return NextResponse.json({ ok: true, downloadUrl });
}
