import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';

export const ACADEMY = 'academy';

// products[] mutation helpers.
//
// The spec calls for array_append / array_remove so other products are never
// clobbered. The supabase-js client can't express those operators in .update(),
// and we may not add an RPC (migrations are out of scope here), so this is an
// equivalent read-modify-write that preserves every other element of the array
// and only adds/removes 'academy'. It is idempotent. If the DB foundation later
// exposes grant_product/revoke_product RPCs, swap these two functions to call
// them for atomicity. See BUILD-NOTES.md.
export async function grantAcademy(service: SupabaseClient, userId: string): Promise<void> {
  const { data } = await service.from('profiles').select('products').eq('id', userId).single();
  const current: string[] = data?.products ?? [];
  if (current.includes(ACADEMY)) return;
  await service
    .from('profiles')
    .update({ products: [...current, ACADEMY] })
    .eq('id', userId);
}

export async function revokeAcademy(service: SupabaseClient, userId: string): Promise<void> {
  const { data } = await service.from('profiles').select('products').eq('id', userId).single();
  const current: string[] = data?.products ?? [];
  if (!current.includes(ACADEMY)) return;
  await service
    .from('profiles')
    .update({ products: current.filter((p) => p !== ACADEMY) })
    .eq('id', userId);
}

export type ResolvedPlan = {
  planId: string;
  slug: string;
  isFounder: boolean;
  interval: 'month' | 'year';
};

// Reverse-resolve a plans row from a Stripe price id (the webhook's direction).
export async function resolvePlanByPrice(
  service: SupabaseClient,
  priceId: string,
): Promise<ResolvedPlan | null> {
  const { data } = await service
    .from('plans')
    .select('id, slug, stripe_monthly_price_id, stripe_annual_price_id')
    .or(`stripe_monthly_price_id.eq.${priceId},stripe_annual_price_id.eq.${priceId}`)
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  const interval: 'month' | 'year' = data.stripe_annual_price_id === priceId ? 'year' : 'month';
  return {
    planId: data.id,
    slug: data.slug,
    isFounder: data.slug === 'all-access-founding',
    interval,
  };
}

// Stripe moved current_period_end onto subscription items in recent API
// versions; read from the item first, fall back to the subscription level.
export function subscriptionPeriodEndISO(sub: Stripe.Subscription): string | null {
  const item = sub.items?.data?.[0] as { current_period_end?: number } | undefined;
  const ts = item?.current_period_end ?? (sub as unknown as { current_period_end?: number }).current_period_end;
  return ts ? new Date(ts * 1000).toISOString() : null;
}

export function firstPriceId(sub: Stripe.Subscription): string | null {
  return sub.items?.data?.[0]?.price?.id ?? null;
}
