import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// Cookie-aware server client for Server Components, Route Handlers, and Server
// Actions that need the logged-in user. Uses the getAll/setAll cookie API (the
// current @supabase/ssr contract — never the deprecated get/set/remove).
//
// Cookies are HOST-SCOPED: we never set a `domain` option. The future SaaS
// domain is unlocked, so there is no cross-domain cookie sharing in P2.
//
// Returns null if env is missing so middleware/layouts can short-circuit.
export async function createClient(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // Safe to ignore — the middleware refreshes the session cookie.
        }
      },
    },
  });
}
