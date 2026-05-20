'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ANALYTICS_EVENTS, trackClient } from '@/lib/analytics';

type Status = 'idle' | 'submitting' | 'success' | 'error';
type FieldErrors = Partial<Record<string, string>>;

export function B2bInquiryForm({ source = 'for-dealers' }: { source?: string }) {
  const [status, setStatus] = React.useState<Status>('idle');
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting') return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      full_name: String(data.get('full_name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      dealer_group: String(data.get('dealer_group') || '').trim(),
      role: String(data.get('role') || '').trim(),
      rooftops: Number(data.get('rooftops') || 0),
      estimated_seats: Number(data.get('estimated_seats') || 0),
      message: String(data.get('message') || ''),
      source,
      website: String(data.get('website') || ''),
    };

    setStatus('submitting');
    setErrorMsg(null);
    setFieldErrors({});
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body: unknown = await res.json().catch(() => ({}));
        const bodyObj = (body && typeof body === 'object' ? (body as Record<string, unknown>) : {});
        const detailsObj = bodyObj.details as { fieldErrors?: Record<string, string[]> } | undefined;
        if (detailsObj?.fieldErrors) {
          const next: FieldErrors = {};
          for (const [k, v] of Object.entries(detailsObj.fieldErrors)) {
            if (Array.isArray(v) && v[0]) next[k] = v[0];
          }
          setFieldErrors(next);
        }
        throw new Error((bodyObj.error as string) || 'Could not submit — try again in a moment.');
      }
      setStatus('success');
      trackClient(ANALYTICS_EVENTS.dealerInquirySubmitted, {
        rooftops: payload.rooftops,
        estimated_seats: payload.estimated_seats,
        role: payload.role,
      });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Could not submit — try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-md border border-success/40 bg-success/10 p-6" role="status">
        <h3 className="font-semibold">Got it.</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Will reads every dealer inquiry personally during the founders phase. Expect a reply within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
      <div className="sm:col-span-2">
        <Label htmlFor="full_name">Your name</Label>
        <Input id="full_name" name="full_name" autoComplete="name" required />
        {fieldErrors.full_name && <p className="text-xs text-destructive mt-1">{fieldErrors.full_name}</p>}
      </div>
      <div>
        <Label htmlFor="email">Work email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
        {fieldErrors.email && <p className="text-xs text-destructive mt-1">{fieldErrors.email}</p>}
      </div>
      <div>
        <Label htmlFor="dealer_group">Dealer group</Label>
        <Input id="dealer_group" name="dealer_group" required />
        {fieldErrors.dealer_group && (
          <p className="text-xs text-destructive mt-1">{fieldErrors.dealer_group}</p>
        )}
      </div>
      <div>
        <Label htmlFor="role">Your role</Label>
        <Input id="role" name="role" placeholder="GM, F&I Director, Trainer..." required />
        {fieldErrors.role && <p className="text-xs text-destructive mt-1">{fieldErrors.role}</p>}
      </div>
      <div>
        <Label htmlFor="rooftops">Rooftops</Label>
        <Input id="rooftops" name="rooftops" type="number" inputMode="numeric" min={1} required />
        {fieldErrors.rooftops && <p className="text-xs text-destructive mt-1">{fieldErrors.rooftops}</p>}
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="estimated_seats">Estimated seats</Label>
        <Input
          id="estimated_seats"
          name="estimated_seats"
          type="number"
          inputMode="numeric"
          min={1}
          required
        />
        {fieldErrors.estimated_seats && (
          <p className="text-xs text-destructive mt-1">{fieldErrors.estimated_seats}</p>
        )}
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="message">Anything we should know? (optional)</Label>
        <Textarea id="message" name="message" rows={4} />
      </div>
      {/* honeypot — must stay empty */}
      <div className="hidden" aria-hidden="true">
        <label>
          Leave this blank
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="sm:col-span-2 flex items-center gap-3">
        <Button type="submit" variant="accent" size="lg" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Send dealer inquiry'}
        </Button>
        {errorMsg && (
          <p className="text-sm text-destructive" role="alert">
            {errorMsg}
          </p>
        )}
      </div>
    </form>
  );
}
