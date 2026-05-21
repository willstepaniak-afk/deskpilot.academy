'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getBrowserClient } from '@/lib/supabase/client';

// Google OAuth is the sole authentication path in P2. Magic-link was removed
// because Gmail's link-prefetch scanner consumes the one-time OTP token before
// the user can click it (Supabase returns otp_expired). Operators who don't use
// Google are provisioned manually via Supabase "Invite user" during the
// founders phase. An OTP *code* flow (typed 6-digit code, immune to prefetch)
// is the right answer when public signup opens in P5+.
type Status = 'idle' | 'redirecting' | 'error';

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const [status, setStatus] = React.useState<Status>('idle');
  const [error, setError] = React.useState<string | null>(null);

  const verb = mode === 'signup' ? 'Sign up' : 'Sign in';

  async function onGoogle() {
    setError(null);
    const supabase = getBrowserClient();
    if (!supabase) {
      setError('Auth is not configured.');
      return;
    }
    setStatus('redirecting');
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

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="default"
        size="lg"
        className="w-full"
        onClick={onGoogle}
        disabled={status === 'redirecting'}
      >
        {status === 'redirecting' ? 'Redirecting…' : `${verb} with Google`}
      </Button>

      {error && (
        <Alert variant="warning" role="alert">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <p className="text-center text-xs text-muted-foreground">
        {mode === 'signup'
          ? 'Access is granted to invited operators during the founders phase.'
          : 'Operator access is Google-only during the founders phase.'}
      </p>
    </div>
  );
}
