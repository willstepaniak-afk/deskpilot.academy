import 'server-only';
import { PostHog } from 'posthog-node';
import type { AnalyticsEvent, AnalyticsProperties } from './analytics';

let cached: PostHog | null = null;

function getPosthog(): PostHog | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
  if (!key) return null;
  if (cached) return cached;
  cached = new PostHog(key, { host, flushAt: 1, flushInterval: 0 });
  return cached;
}

export async function trackServer(args: {
  event: AnalyticsEvent;
  distinctId: string;
  properties?: AnalyticsProperties;
}) {
  const ph = getPosthog();
  if (!ph) return;
  try {
    ph.capture({
      distinctId: args.distinctId,
      event: args.event,
      properties: args.properties,
    });
    await ph.flush();
  } catch {
    // analytics must never break the request
  }
}
