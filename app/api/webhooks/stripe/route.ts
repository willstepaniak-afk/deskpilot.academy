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

  // Idempotency: first writer wins. 23505 = already seen -> ack, do nothing.
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

// The interval Stripe is actually billing. billing_interval is NOT NULL (§4.2),
// so never fall back to null when a plan fails to resolve — fall back to here.
// A real recurring subscription always carries this.
function intervalOf(sub: Stripe.Subscription): string | null {
  return sub.items?.data?.[0]?.price?.recurring?.interval ?? null;
}

// Resolve a Stripe subscription id -> our subscriptions.id uuid (for payments FK).
async function subUuidFor(
  service: SupabaseClient,
  stripeSubId: string | null,
): Promise<string | null> {
  if (!stripeSubId) return null;
  const { data } = await service
    .from('subscriptions')
    .select('id')
    .eq('stripe_subscription_id', stripeSubId)
    .maybeSingle();
  return data?.id ?? null;
}

// ---- handlers -------------------------------------------------------------

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

  // Row FIRST (is_founder defaults false), so the claim has a row to flip. (C1/C2)
  await service.from('subscriptions').upsert(
    {
      user_id: userId,
      stripe_customer_id: customerIdOf(sub.customer),
      stripe_subscription_id: sub.id,
      stripe_price_id: priceId,
      plan_id: plan?.planId ?? null,
      status: sub.status,
      billing_interval: plan?.interval ?? intervalOf(sub),
      cancel_at_period_end: sub.cancel_at_period_end ?? false,
      current_period_end: periodEnd,
      past_due_since: null,
      canceled_at: null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'stripe_subscription_id' },
  );

  // Claim SECOND. The function does the atomic dedup
  // (UPDATE ... WHERE is_founder IS NOT TRUE) so concurrent/retried
  // deliveries cannot double-burn a seat. No manual SELECT-then-decide. (C1)
  if (plan?.isFounder) {
    const { error: rpcErr } = await service.rpc('claim_founder_seat', {
      p_stripe_subscription_id: sub.id,
    });
    if (rpcErr) console.error('[stripe] claim_founder_seat error', rpcErr.message);
  }

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
      billing_interval: plan?.interval ?? intervalOf(sub),
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

  if (sub.status === 'active') {
    await grantAcademy(service, userId);
  } else if (
    sub.status === 'canceled' ||
    sub.status === 'unpaid' ||
    sub.status === 'incomplete_expired'
  ) {
    await revokeAcademy(service, userId);
  }
  // past_due / incomplete / trialing: leave products[] untouched. During the 72h
  // grace, access stays ON (granted at creation); the failed-payment handler +
  // cron/lazy-guard own revocation. Re-granting here re-opens what dunning closed.
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
  const periodEndUnix = invoice.lines?.data?.[0]?.period?.end;
  const periodEnd = periodEndUnix ? new Date(periodEndUnix * 1000).toISOString() : undefined;

  const subUuid = await subUuidFor(service, subscriptionId); // C3

  await service.from('payments').insert({
    user_id: userId,
    subscription_id: subUuid, // C3: payments has subscription_id uuid, not stripe_subscription_id
    stripe_invoice_id: invoice.id,
    amount_cents: invoice.amount_paid,
    currency: invoice.currency,
    status: 'paid',
    paid_at: new Date().toISOString(),
    invoice_pdf_url: invoice.invoice_pdf ?? null,
  });

  if (subscriptionId) {
    await service
      .from('subscriptions')
      .update({
        status: 'active',
        past_due_since: null,
        ...(periodEnd ? { current_period_end: periodEnd } : {}), // L8
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionId);
  }
  if (userId) {
    await service
      .from('profiles')
      .update({
        subscription_status: 'active',
        ...(periodEnd ? { current_period_end: periodEnd } : {}),
      })
      .eq('id', userId);
    await grantAcademy(service, userId); // H6: restore access after a late successful retry
  }
}

async function onInvoiceFailed(invoice: Stripe.Invoice, service: SupabaseClient): Promise<void> {
  const customerId = customerIdOf(invoice.customer);
  const subscriptionId = subscriptionIdOf(invoice);
  const userId = await userIdFromCustomer(service, customerId);

  const subUuid = await subUuidFor(service, subscriptionId); // C3

  await service.from('payments').insert({
    user_id: userId,
    subscription_id: subUuid, // C3
    stripe_invoice_id: invoice.id,
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
    if (existing && !existing.past_due_since) {
      await service
        .from('subscriptions')
        .update({
          status: 'past_due',
          past_due_since: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
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
  // invoice.subscription is string | Subscription | null across versions;
  // newer versions nest under parent.subscription_details. Resolve defensively.
  const direct = (invoice as unknown as { subscription?: string | { id: string } | null }).subscription;
  if (direct) return customerIdOf(direct);
  const parentSub = (invoice as unknown as {
    parent?: { subscription_details?: { subscription?: string | { id: string } } };
  }).parent?.subscription_details?.subscription;
  return parentSub ? customerIdOf(parentSub) : null;
}
