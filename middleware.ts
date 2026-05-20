import { NextResponse, type NextRequest } from 'next/server';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)'],
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
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

  return response;
}
