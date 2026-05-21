import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)'],
};

function applySecurityHeaders(response: NextResponse, request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const isPreview =
    process.env.VERCEL_ENV === 'preview' || host.endsWith('.vercel.app');
  if (isPreview) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

export async function middleware(request: NextRequest) {
  // Refresh the Supabase session. `response` is the cookie-carrying object —
  // all headers/redirects below must build on it, never a fresh next().
  const { response, user } = await updateSession(request);

  // Dashboard auth gate. Product-level gating ('academy') happens in the
  // dashboard layout; here we only require an authenticated session.
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', request.nextUrl.pathname);
    const redirect = NextResponse.redirect(url);
    applySecurityHeaders(redirect, request);
    return redirect;
  }

  applySecurityHeaders(response, request);
  return response;
}
