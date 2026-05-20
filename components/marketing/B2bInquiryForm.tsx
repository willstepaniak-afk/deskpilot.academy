'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { b2bInquirySchema, type B2bInquiryInput } from '@/lib/validators';
import { ANALYTICS_EVENTS, trackClient } from '@/lib/analytics';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function B2bInquiryForm({ source = 'for-dealers' }: { source?: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<B2bInquiryInput>({
    resolver: zodResolver(b2bInquirySchema),
    defaultValues: { source, website: '' },
  });
  const [status, setStatus] = React.useState<Status>('idle');
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const onSubmit = handleSubmit(async (values) => {
    setStatus('submitting');
    setErrorMsg(null);
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Could not submit — try again in a moment.');
      }
      setStatus('success');
      trackClient(ANALYTICS_EVENTS.dealerInquirySubmitted, {
        rooftops: values.rooftops,
        estimated_seats: values.estimated_seats,
        role: values.role,
      });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Could not submit — try again.');
    }
  });

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
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
      <div className="sm:col-span-2">
        <Label htmlFor="full_name">Your name</Label>
        <Input id="full_name" autoComplete="name" {...register('full_name')} />
        {errors.full_name && (
          <p className="text-xs text-destructive mt-1">{errors.full_name.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="email">Work email</Label>
        <Input id="email" type="email" autoComplete="email" {...register('email')} />
        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="dealer_group">Dealer group</Label>
        <Input id="dealer_group" {...register('dealer_group')} />
        {errors.dealer_group && (
          <p className="text-xs text-destructive mt-1">{errors.dealer_group.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="role">Your role</Label>
        <Input id="role" placeholder="GM, F&I Director, Trainer..." {...register('role')} />
        {errors.role && <p className="text-xs text-destructive mt-1">{errors.role.message}</p>}
      </div>
      <div>
        <Label htmlFor="rooftops">Rooftops</Label>
        <Input id="rooftops" type="number" inputMode="numeric" min={1} {...register('rooftops')} />
        {errors.rooftops && (
          <p className="text-xs text-destructive mt-1">{errors.rooftops.message}</p>
        )}
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="estimated_seats">Estimated seats</Label>
        <Input
          id="estimated_seats"
          type="number"
          inputMode="numeric"
          min={1}
          {...register('estimated_seats')}
        />
        {errors.estimated_seats && (
          <p className="text-xs text-destructive mt-1">{errors.estimated_seats.message}</p>
        )}
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="message">Anything we should know? (optional)</Label>
        <Textarea id="message" rows={4} {...register('message')} />
      </div>
      {/* honeypot — must stay empty */}
      <div className="hidden" aria-hidden="true">
        <label>
          Leave this blank
          <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
        </label>
      </div>
      <input type="hidden" {...register('source')} />
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
