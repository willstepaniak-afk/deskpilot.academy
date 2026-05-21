'use client';

import * as React from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getBrowserClient } from '@/lib/supabase/client';
import { SITE } from '@/lib/site';

type Status = 'idle' | 'google' | 'sending' | 'sent' | 'error';

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const [email, setEmail] = React.useState('');
  const [token, setToken] = React.useState('');
  const [status, setStatus] = React.useState<Status>('idle');
  const [error, setError] = React.useState<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const verb = mode === 'signup' ? 'Sign up' : 'Sign in';

  async function onGoogle() {
    setError(null);
    const supabase = getBrowserClient();
    if (!supabase) {
      setError('Auth is not configured.');
      return;
    }
    setStatus('google');
    const { error: oauthErr } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthErr) {
      setStatus('error');
      setError(oauthErr.message);
    }
    // On success the browser redirects to Google — nothing else to do.
  }

  async function onMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    if (siteKey && !token) {
      setError('Please complete the verification challenge.');
      return;
    }
    setStatus('sending');
    setError(null);
    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, turnstileToken: token || 'dev' }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Could not send the link — try again.');
      }
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Could not send the link — try again.');
    }
  }

  if (status === 'sent') {
    return (
      <Alert variant="success" role="status">
        <AlertDescription>
          Check your inbox — we sent a sign-in link to <strong>{email}</strong>. It expires shortly,
          so use it soon.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        onClick={onGoogle}
        disabled={status === 'google'}
      >
        {status === 'google' ? 'Redirecting…' : `${verb} with Google`}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">or by email</span>
        </div>
      </div>

      <form onSubmit={onMagicLink} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@dealership.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
        </div>

        {siteKey ? (
          <Turnstile
            siteKey={siteKey}
            onSuccess={setToken}
            onExpire={() => setToken('')}
            onError={() => setToken('')}
            options={{ theme: 'dark' }}
          />
        ) : (
          <p className="text-xs text-muted-foreground">
            Turnstile not configured — magic link runs without bot protection in this environment.
          </p>
        )}

        <Button type="submit" variant="accent" size="lg" className="w-full" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : `Email me a sign-in link`}
        </Button>

        {error && (
          <Alert variant="warning" role="alert">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </form>

      <p className="text-center text-xs text-muted-foreground">
        {mode === 'signup'
          ? 'Access is granted to invited operators during the founders phase.'
          : `Sign in to ${SITE.shortName}.`}
      </p>
    </div>
  );
}
