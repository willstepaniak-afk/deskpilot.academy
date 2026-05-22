'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Status = 'idle' | 'redirecting' | 'error';

function dollars(cents: number): string {
  const v = cents / 100;
  return v % 1 === 0 ? `$${v.toLocaleString('en-US')}` : `$${v.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

export function SubscribeForm({
  isFounder,
  foundersRemaining,
  monthlyCents,
  annualCents,
  canceled,
}: {
  isFounder: boolean;
  foundersRemaining: number;
  monthlyCents: number;
  annualCents: number;
  canceled: boolean;
}) {
  const [interval, setInterval] = React.useState<'month' | 'year'>('month');
  const [status, setStatus] = React.useState<Status>('idle');
  const [error, setError] = React.useState<string | null>(null);

  const cents = interval === 'year' ? annualCents : monthlyCents;
  const cadence = interval === 'year' ? '/year' : '/month';
  // annual equivalent monthly, for the "two months free" framing
  const annualPerMonth = dollars(Math.round(annualCents / 12));

  async function subscribe() {
    if (status === 'redirecting') return;
    setStatus('redirecting');
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Could not start checkout — try again.');
      }
      const { url } = (await res.json()) as { url?: string };
      if (!url) throw new Error('Could not start checkout — try again.');
      window.location.href = url;
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Could not start checkout — try again.');
    }
  }

  return (
    <div className="space-y-6">
      {canceled && (
        <Alert>
          <AlertDescription>
            No problem — your checkout was canceled and you haven&apos;t been charged. Ready when you are.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-center gap-1 rounded-md border border-border p-1 w-fit mx-auto">
        <button
          type="button"
          onClick={() => setInterval('month')}
          className={`rounded px-4 py-1.5 text-sm font-medium transition-colors ${
            interval === 'month' ? 'bg-secondary text-foreground' : 'text-muted-foreground'
          }`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setInterval('year')}
          className={`rounded px-4 py-1.5 text-sm font-medium transition-colors ${
            interval === 'year' ? 'bg-secondary text-foreground' : 'text-muted-foreground'
          }`}
        >
          Annual <span className="text-xs text-success">save ~2 mo</span>
        </button>
      </div>

      <Card className="p-8 text-center max-w-md mx-auto">
        {isFounder ? (
          <Badge variant="accent" className="mx-auto">
            Founders pricing — {foundersRemaining} of 100 seats left
          </Badge>
        ) : (
          <Badge variant="outline" className="mx-auto">
            All-Access
          </Badge>
        )}
        <p className="mt-4 text-4xl font-bold">
          {dollars(cents)}
          <span className="text-base font-normal text-muted-foreground">{cadence}</span>
        </p>
        {interval === 'year' && (
          <p className="mt-1 text-sm text-muted-foreground">{annualPerMonth}/mo billed annually</p>
        )}
        <p className="mt-4 text-sm text-muted-foreground">
          Every campus, every module, the AI deal simulator, and new content as it ships.
          {isFounder && ' Your founder rate is locked for as long as you stay subscribed.'}
        </p>

        <Button
          variant="accent"
          size="lg"
          className="mt-6 w-full"
          onClick={subscribe}
          disabled={status === 'redirecting'}
        >
          {status === 'redirecting' ? 'Starting checkout…' : 'Subscribe'}
        </Button>

        {error && (
          <Alert variant="warning" className="mt-4 text-left">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          Secure checkout via Stripe. Cancel anytime from your billing portal.
        </p>
      </Card>
    </div>
  );
}
