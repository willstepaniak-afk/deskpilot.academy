import 'server-only';
import { cache } from 'react';
import { createClient } from './supabase/server';

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  products: string[];
  founders_member: boolean;
  created_at: string;
  updated_at: string;
  // Billing columns (P3) — present on the row; selected via '*'.
  stripe_customer_id?: string | null;
  subscription_status?: string | null;
  subscription_plan_id?: string | null;
  current_period_end?: string | null;
};

// cache() dedupes these within a single request so the dashboard layout and
// page don't each round-trip to Supabase.

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getProfile = cache(async (): Promise<Profile | null> => {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  return (data as Profile) ?? null;
});

export function hasAcademyAccess(profile: Profile | null): boolean {
  return !!profile?.products?.includes('academy');
}
