'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ANALYTICS_EVENTS, trackClient } from '@/lib/analytics';

export type LeadMagnet = {
  slug: string;
  title: string;
  description: string;
  badge?: string;
};

type Status = 'idle' | 'submitting' | 'error';

export function LeadMagnetCard({ resource }: { resource: LeadMagnet }) {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState<Status>('idle');
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting') return;
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email') || '').trim();
    if (!email) {
      setErrorMsg('Email is required.');
      return;
    }
    setStatus('submitting');
    setErrorMsg(null);
    try {
      const res = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resource_slug: resource.slug }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Could not save your interest — try again.');
      }
      trackClient(ANALYTICS_EVENTS.leadMagnetRequested, {
        resource_slug: resource.slug,
        state: 'notify-me-state',
      });
      router.push(`/thank-you?resource=${encodeURIComponent(resource.slug)}&type=notify`);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Could not save your interest — try again.');
    }
  }

  return (
    <Card className="h-full p-5 flex flex-col">
      <div className="flex items-center justify-between gap-3 mb-3">
        {resource.badge ? (
          <Badge variant="outline" className="self-start">
            {resource.badge}
          </Badge>
        ) : (
          <span />
        )}
        <Badge variant="accent">Coming soon</Badge>
      </div>
      <h3 className="text-lg font-semibold">{resource.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground flex-1">{resource.description}</p>

      <div className="mt-5">
        {!open ? (
          <Button variant="outline" className="w-full" onClick={() => setOpen(true)}>
            Notify Me When Available
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2" noValidate>
            <Label htmlFor={`email-${resource.slug}`} className="sr-only">
              Email for {resource.title}
            </Label>
            <Input
              id={`email-${resource.slug}`}
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@dealership.com"
            />
            <Button type="submit" variant="accent" className="w-full" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Sending…' : 'Notify me'}
            </Button>
            {errorMsg && (
              <p className="text-sm text-destructive" role="alert">
                {errorMsg}
              </p>
            )}
          </form>
        )}
      </div>
    </Card>
  );
}
