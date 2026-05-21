import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Service-role admin client. Bypasses RLS — used by the write API routes.
// Stateless: no session, no cookies. Returns null if env is missing so the
// app degrades gracefully instead of throwing at import time.
let cached: SupabaseClient | null = null;

export function getServiceClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  if (cached) return cached;
  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
