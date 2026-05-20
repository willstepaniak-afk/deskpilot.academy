'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ANALYTICS_EVENTS, trackClient } from '@/lib/analytics';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export type Resource = {
  slug: string;
  title: string;
  description: string;
  badge?: string;
};

export function ResourceRequestDialog({ resource }: { resource: Resource }) {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<Status>('idle');
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    setErrorMsg(null);
    try {
      const res = await fetch('/api/resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resource_slug: resource.slug }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Could not send the resource — try again.');
      }
      const body = (await res.json()) as { downloadUrl?: string };
      setStatus('success');
      setDownloadUrl(body.downloadUrl ?? null);
      trackClient(ANALYTICS_EVENTS.leadMagnetRequested, { resource_slug: resource.slug });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Could not send the resource — try again.');
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Get the {resource.title}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Get the {resource.title}</DialogTitle>
          <DialogDescription>{resource.description}</DialogDescription>
        </DialogHeader>
        {status === 'success' ? (
          <div className="space-y-3">
            <p className="text-sm">Check your inbox — we&apos;ll also email you a copy.</p>
            {downloadUrl && (
              <Button asChild variant="accent">
                <a href={downloadUrl} target="_blank" rel="noreferrer">
                  Download now
                </a>
              </Button>
            )}
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3" noValidate>
            <div>
              <Label htmlFor={`email-${resource.slug}`}>Your email</Label>
              <Input
                id={`email-${resource.slug}`}
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" variant="accent" disabled={status === 'submitting'} className="w-full">
              {status === 'submitting' ? 'Sending…' : 'Send it to me'}
            </Button>
            {errorMsg && (
              <p className="text-sm text-destructive" role="alert">
                {errorMsg}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              We&apos;ll only email about Academy launch updates. No spam, no resale.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
