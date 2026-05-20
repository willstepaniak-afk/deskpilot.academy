'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { trackClient, ANALYTICS_EVENTS } from '@/lib/analytics';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function WaitlistForm({
  source,
  foundersTier = false,
  className,
  buttonLabel = 'Join the waitlist',
}: {
  source: string;
  foundersTier?: boolean;
  className?: string;
  buttonLabel?: string;
}) {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<Status>('idle');
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    setErrorMsg(null);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, founders_tier_interest: foundersTier }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Could not sign you up — try again in a moment.');
      }
      setStatus('success');
      trackClient(ANALYTICS_EVENTS.waitlistSignup, {
        source,
        founders_tier_interest: foundersTier,
      });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Could not sign you up — try again.');
    }
  }

  if (status === 'success') {
    return (
      <div
        className={`rounded-md border border-success/40 bg-success/10 p-4 text-sm ${className ?? ''}`}
        role="status"
      >
        Thanks. We&apos;ll email you when {foundersTier ? 'your founders seat is ready' : 'the Academy opens'}.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`flex flex-col sm:flex-row gap-2 ${className ?? ''}`} noValidate>
      <label className="sr-only" htmlFor={`email-${source}`}>
        Email address
      </label>
      <Input
        id={`email-${source}`}
        type="email"
        autoComplete="email"
        required
        placeholder="you@dealership.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" variant="accent" size="lg" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : buttonLabel}
      </Button>
      {errorMsg && (
        <p className="text-sm text-destructive sm:basis-full" role="alert">
          {errorMsg}
        </p>
      )}
    </form>
  );
}
