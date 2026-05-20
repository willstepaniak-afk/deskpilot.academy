'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ANALYTICS_EVENTS, trackClient } from '@/lib/analytics';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function CampusInterestForm({ campusSlug, campusName }: { campusSlug: string; campusName: string }) {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<Status>('idle');
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    setErrorMsg(null);
    try {
      const res = await fetch('/api/campus-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, campus_slug: campusSlug }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Could not save your interest — try again.');
      }
      setStatus('success');
      trackClient(ANALYTICS_EVENTS.campusInterestSubmitted, { campus_slug: campusSlug });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Could not save your interest — try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-md border border-success/40 bg-success/10 p-4 text-sm" role="status">
        Got it. We&apos;ll email you when {campusName} opens.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md" noValidate>
      <Input
        type="email"
        required
        autoComplete="email"
        placeholder="you@dealership.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1"
        aria-label="Email address"
      />
      <Button type="submit" variant="accent" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Notify me'}
      </Button>
      {errorMsg && (
        <p className="text-sm text-destructive sm:basis-full" role="alert">
          {errorMsg}
        </p>
      )}
    </form>
  );
}
