import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getStripe } from '@/lib/stripe';
import { getServiceClient } from '@/lib/supabase/service';
import {
  grantAcademy,
  revokeAcademy,
  resolvePlanByPrice,
  subscriptionPeriodEndISO,
  firstPriceId,
} from '@/lib/billing';

export const runtime = 'nodejs';

// Only these 8 event types are handled. Everything else is acknowledged 200
// and ignored.
const HANDLED = new Set<string>([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'customer.created',
  'customer.updated',
]);

export async function POST(request: Request) {
  const stripe = getStripe();
  const service = getServiceClient();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !service || !secret) {
    return new NextResponse('Billing not configured', { status: 503 });
  }

  const sig = request.headers.get('stripe-signature');
  if (!sig) return new NextResponse('Missing signature', { status: 400 });

  // Verify against the RAW body. Do not parse before verifying.
  const raw = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch {
    return new NextResponse('Invalid signature', { status: 400 });
  }

  // Idempotency: first writer wins. A unique violation (23505) means we've
  // already seen this event — ack and do nothing.
  const { error: insErr } = await service
    .from('stripe_events')
    .insert({ event_id: event.id, event_type: event.type });
  if (insErr) {
    if (insErr.code === '23505') {
      return NextResponse.json({ received: true, duplicate: true });
    }
    console.error('[stripe] stripe_events insert failed', insErr.message);
    return new NextResponse('Storage error', { status: 500 });
  }

  if (!HANDLED.has(event.type)) {
    return NextResponse.json({ received: true, ignored: true });
  }

  try {
    await dispatch(event, service);
  } catch (err) {
    console.error('[stripe] handler error', event.type, err instanceof Error ? err.message : err);
    return new NextResponse('Handler error', { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function dispatch(event: Stripe.Event, service: SupabaseClient): Promise<void> {
  switch (event.type) {
    case 'checkout.session.completed':
      return onCheckoutCompleted(event.data.object as Stripe.Checkout.Session, service);
    case 'customer.subscription.created':
      return onSubscriptionCreated(event.data.object as Stripe.Subscription, service);
    case 'customer.subscription.updated':
      return onSubscriptionUpdated(event.data.object as Stripe.Subscription, service);
    case 'customer.subscription.deleted':
      return onSubscriptionDeleted(event.data.object as Stripe.Subscription, service);
    case 'invoice.payment_succeeded':
      return onInvoicePaid(event.data.object as Stripe.Invoice, service);
    case 'invoice.payment_failed':
      return onInvoiceFailed(event.data.object as Stripe.Invoice, service);
    case 'customer.created':
    case 'customer.updated':
      return onCustomerSync(event.data.object as Stripe.Customer, service);
  }
}

// ---- user resolution ------------------------------------------------------

function userIdFromMetadata(meta: Stripe.Metadata | null | undefined): string | null {
  return meta?.supabase_user_id ?? null;
}

async function userIdFromCustomer(
  service: SupabaseClient,
  customerId: string | null,
): Promise<string | null> {
  if (!customerId) return null;
  const { data } = await service
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .maybeSingle();
  return data?.id ?? null;
}

function customerIdOf(value: string | { id: string } | null | undefined): string | null {
  if (!value) return null;
  return typeof value === 'string' ? value : value.id;
}

// ---- handlers -------------------------------------------------------------

// Primary "they're in" signal — make sure the customer id is persisted.
async function onCheckoutCompleted(
  session: Stripe.Checkout.Session,
  service: SupabaseClient,
): Promise<void> {
  const userId = session.client_reference_id ?? userIdFromMetadata(session.metadata);
  const customerId = customerIdOf(session.customer);
  if (userId && customerId) {
    await service.from('profiles').update({ stripe_customer_id: customerId }).eq('id', userId);
  }
}

async function onSubscriptionCreated(
  sub: Stripe.Subscription,
  service: SupabaseClient,
): Promise<void> {
  const userId =
    userIdFromMetadata(sub.metadata) ??
    (await userIdFromCustomer(service, customerIdOf(sub.customer)));
  if (!userId) {
    console.error('[stripe] subscription.created: no supabase user id for', sub.id);
    return;
  }
  const priceId = firstPriceId(sub);
  const plan = priceId ? await resolvePlanByPrice(service, priceId) : null;
  const periodEnd = subscriptionPeriodEndISO(sub);

  // Founder claim: only if this is a founder price and the row isn't already
  // marked is_founder. claim_founder_seat() atomically decrements the counter
  // and returns whether a seat was actually secured.
  let isFounder = false;
  if (plan?.isFounder) {
    const { data: existing } = await service
      .from('subscriptions')
      .select('is_founder')
      .eq('stripe_subscription_id', sub.id)
      .maybeSingle();
    if (existing?.is_founder === true) {
      isFounder = true;
    } else {
      const { data: claimed, error: rpcErr } = await service.rpc('claim_founder_seat');
      if (rpcErr) console.error('[stripe] claim_founder_seat error', rpcErr.message);
      isFounder = claimed === true;
    }
  }

  await service.from('subscriptions').upsert(
    {
      user_id: userId,
      stripe_customer_id: customerIdOf(sub.customer),
      stripe_subscription_id: sub.id,
      stripe_price_id: priceId,
      plan_id: plan?.planId ?? null,
      status: sub.status,
      is_founder: isFounder,
      interval: plan?.interval ?? null,
      cancel_at_period_end: sub.cancel_at_period_end ?? false,
      current_period_end: periodEnd,
      past_due_since: null,
      canceled_at: null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'stripe_subscription_id' },
  );

  await service
    .from('profiles')
    .update({
      subscription_status: 'active',
      subscription_plan_id: plan?.planId ?? null,
      current_period_end: periodEnd,
    })
    .eq('id', userId);

  await grantAcademy(service, userId);
}

async function onSubscriptionUpdated(
  sub: Stripe.Subscription,
  service: SupabaseClient,
): Promise<void> {
  const userId =
    userIdFromMetadata(sub.metadata) ??
    (await userIdFromCustomer(service, customerIdOf(sub.customer)));
  if (!userId) {
    console.error('[stripe] subscription.updated: no supabase user id for', sub.id);
    return;
  }
  const priceId = firstPriceId(sub);
  const plan = priceId ? await resolvePlanByPrice(service, priceId) : null;
  const periodEnd = subscriptionPeriodEndISO(sub);
  const canceledAt =
    sub.status === 'canceled'
      ? (sub.canceled_at ? new Date(sub.canceled_at * 1000).toISOString() : new Date().toISOString())
      : null;

  await service
    .from('subscriptions')
    .update({
      status: sub.status,
      stripe_price_id: priceId,
      plan_id: plan?.planId ?? null,
      interval: plan?.interval ?? null,
      cancel_at_period_end: sub.cancel_at_period_end ?? false,
      current_period_end: periodEnd,
      canceled_at: canceledAt,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', sub.id);

  await service
    .from('profiles')
    .update({
      subscription_status: sub.status,
      subscription_plan_id: plan?.planId ?? null,
      current_period_end: periodEnd,
    })
    .eq('id', userId);

  // active or past_due (during grace) keep access; canceled revokes.
  if (sub.status === 'canceled') {
    await revokeAcademy(service, userId);
  } else {
    await grantAcademy(service, userId);
  }
}

async function onSubscriptionDeleted(
  sub: Stripe.Subscription,
  service: SupabaseClient,
): Promise<void> {
  const userId =
    userIdFromMetadata(sub.metadata) ??
    (await userIdFromCustomer(service, customerIdOf(sub.customer)));
  if (!userId) return;
  const now = new Date().toISOString();

  await service
    .from('subscriptions')
    .update({ status: 'canceled', canceled_at: now, updated_at: now })
    .eq('stripe_subscription_id', sub.id);

  await service.from('profiles').update({ subscription_status: 'canceled' }).eq('id', userId);
  await revokeAcademy(service, userId);
}

async function onInvoicePaid(invoice: Stripe.Invoice, service: SupabaseClient): Promise<void> {
  const customerId = customerIdOf(invoice.customer);
  const subscriptionId = subscriptionIdOf(invoice);
  const userId = await userIdFromCustomer(service, customerId);

  await service.from('payments').insert({
    user_id: userId,
    stripe_invoice_id: invoice.id,
    stripe_subscription_id: subscriptionId,
    amount_cents: invoice.amount_paid,
    currency: invoice.currency,
    status: 'paid',
    paid_at: new Date().toISOString(),
    invoice_pdf_url: invoice.invoice_pdf ?? null,
  });

  if (subscriptionId) {
    await service
      .from('subscriptions')
      .update({ status: 'active', past_due_since: null, updated_at: new Date().toISOString() })
      .eq('stripe_subscription_id', subscriptionId);
  }
  if (userId) {
    const periodEndUnix = invoice.lines?.data?.[0]?.period?.end;
    const periodEnd = periodEndUnix ? new Date(periodEndUnix * 1000).toISOString() : undefined;
    await service
      .from('profiles')
      .update({
        subscription_status: 'active',
        ...(periodEnd ? { current_period_end: periodEnd } : {}),
      })
      .eq('id', userId);
  }
}

async function onInvoiceFailed(invoice: Stripe.Invoice, service: SupabaseClient): Promise<void> {
  const customerId = customerIdOf(invoice.customer);
  const subscriptionId = subscriptionIdOf(invoice);
  const userId = await userIdFromCustomer(service, customerId);

  await service.from('payments').insert({
    user_id: userId,
    stripe_invoice_id: invoice.id,
    stripe_subscription_id: subscriptionId,
    amount_cents: invoice.amount_due,
    currency: invoice.currency,
    status: 'failed',
    failure_reason:
      (invoice.last_finalization_error?.message as string | undefined) ?? 'payment_failed',
  });

  // Start the 72h grace clock once. Access STAYS ON during grace.
  if (subscriptionId) {
    const { data: existing } = await service
      .from('subscriptions')
      .select('status, past_due_since')
      .eq('stripe_subscription_id', subscriptionId)
      .maybeSingle();
    if (existing && existing.status !== 'past_due') {
      await service
        .from('subscriptions')
        .update({ status: 'past_due', past_due_since: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('stripe_subscription_id', subscriptionId);
      if (userId) {
        await service.from('profiles').update({ subscription_status: 'past_due' }).eq('id', userId);
      }
    }
  }
}

async function onCustomerSync(customer: Stripe.Customer, service: SupabaseClient): Promise<void> {
  const userId =
    userIdFromMetadata(customer.metadata) ?? (await userIdFromCustomer(service, customer.id));
  if (!userId) return;
  await service
    .from('profiles')
    .update({
      stripe_customer_id: customer.id,
      ...(customer.email ? { email: customer.email } : {}),
    })
    .eq('id', userId);
}

function subscriptionIdOf(invoice: Stripe.Invoice): string | null {
  // Invoice.subscription is a string | Subscription | null across versions;
  // newer versions nest it under parent. Resolve defensively.
  const direct = (invoice as unknown as { subscription?: string | { id: string } | null }).subscription;
  if (direct) return customerIdOf(direct);
  const parentSub = (invoice as unknown as {
    parent?: { subscription_details?: { subscription?: string | { id: string } } };
  }).parent?.subscription_details?.subscription;
  return parentSub ? customerIdOf(parentSub) : null;
}
