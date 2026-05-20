import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cachedBrowser: SupabaseClient | null = null;

export function getBrowserClient(): SupabaseClient | null {
  if (typeof window === 'undefined') return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  if (cachedBrowser) return cachedBrowser;
  cachedBrowser = createClient(url, anonKey);
  return cachedBrowser;
}
