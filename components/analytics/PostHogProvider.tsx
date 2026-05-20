'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
    if (!key) return;
    const loaded = (posthog as unknown as { __loaded?: boolean }).__loaded;
    if (loaded) return;
    posthog.init(key, {
      api_host: host,
      capture_pageview: true,
      capture_pageleave: true,
      persistence: 'localStorage+cookie',
    });
  }, []);
  return <>{children}</>;
}
