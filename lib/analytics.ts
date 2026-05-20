export const ANALYTICS_EVENTS = {
  waitlistSignup: 'waitlist_signup',
  dealerInquirySubmitted: 'dealer_inquiry_submitted',
  leadMagnetRequested: 'lead_magnet_requested',
  campusInterestSubmitted: 'campus_interest_submitted',
  pricingCtaClicked: 'pricing_cta_clicked',
} as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export type AnalyticsProperties = Record<string, string | number | boolean | undefined>;

// Client-side fire-and-forget tracker. Safe no-op when posthog-js is not initialized.
export function trackClient(event: AnalyticsEvent, properties?: AnalyticsProperties) {
  if (typeof window === 'undefined') return;
  const ph = (window as unknown as { posthog?: { capture: (e: string, p?: object) => void } })
    .posthog;
  if (!ph || typeof ph.capture !== 'function') return;
  try {
    ph.capture(event, properties);
  } catch {
    // swallow — analytics must never break the app
  }
}
