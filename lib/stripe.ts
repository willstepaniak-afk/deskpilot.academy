import 'server-only';
import Stripe from 'stripe';

// Server-only Stripe client singleton. Never import into a client component.
// apiVersion is pinned so an SDK upgrade can't silently change request/response
// shapes — bump it deliberately. Returns null if the secret is absent so the
// app degrades gracefully instead of throwing at import time.
let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (cached) return cached;
  cached = new Stripe(key, {
    apiVersion: '2026-04-22.dahlia',
    appInfo: { name: 'DeskPilot Academy', url: 'https://www.deskpilot.academy' },
  });
  return cached;
}
