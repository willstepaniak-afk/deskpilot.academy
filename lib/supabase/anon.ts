import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Anon, cookie-less, stateless read client for public data (e.g. /api/counters
// reading site_state under its public-read RLS policy). Intentionally NOT
// cookie-aware — making it so would force consuming routes dynamic. Returns
// null if env is missing.
let cached: SupabaseClient | null = null;

export function getServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  if (cached) return cached;
  cached = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
