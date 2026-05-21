import { NextResponse } from 'next/server';
import { magicLinkSchema } from '@/lib/validators';
import { createClient } from '@/lib/supabase/server';
import { SITE } from '@/lib/site';

export const runtime = 'nodejs';

// Server-gated magic-link send. The OTP email is dispatched ONLY after the
// Cloudflare Turnstile token verifies — the browser never calls signInWithOtp
// directly. This protects the Supabase email rate limit and keeps disposable-
// email spam out of auth.users.
async function verifyTurnstile(token: string, remoteIp: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // No secret configured (e.g. local dev without Turnstile) — fail closed in
    // production, allow in development so the flow is testable locally.
    return process.env.NODE_ENV !== 'production';
  }
  try {
    const body = new URLSearchParams();
    body.set('secret', secret);
    body.set('response', token);
    if (remoteIp) body.set('remoteip', remoteIp);
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = magicLinkSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  const { email, turnstileToken } = parsed.data;

  const remoteIp = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for');
  const ok = await verifyTurnstile(turnstileToken, remoteIp);
  if (!ok) {
    return NextResponse.json({ error: 'Verification failed — please try again.' }, { status: 400 });
  }

  const supabase = await createClient();
  if (!supabase) {
    console.log('[magic-link] no supabase client configured — would send to:', email);
    return NextResponse.json({ ok: true, mode: 'logged' });
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${SITE.url}/auth/callback` },
  });
  if (error) {
    console.error('[magic-link] signInWithOtp error', error.message);
    return NextResponse.json({ error: 'Could not send the link — try again shortly.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
