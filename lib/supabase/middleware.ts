import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { User } from '@supabase/supabase-js';

// Refreshes the Supabase session on every request and syncs the auth cookies
// onto the outgoing response. The returned `response` is the one that carries
// the refreshed cookies — the caller MUST apply any additional headers to THIS
// object and return it (not a fresh NextResponse.next()), or the refreshed
// cookies are lost. This is the #1 @supabase/ssr middleware gotcha.
//
// Cookies are host-scoped (no `domain` option).
export async function updateSession(
  request: NextRequest,
): Promise<{ response: NextResponse; user: User | null }> {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    // Env not configured — don't attempt auth; let the request through.
    return { response, user: null };
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Must call getUser() immediately — it revalidates and refreshes the token.
  // Do NOT insert any logic between client creation and this call.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
