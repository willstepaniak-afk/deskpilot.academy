import {
  BUNDLE_MONTHLY_USD,
  FOUNDERS_TIER_PRICE_USD,
  STANDARD_ANNUAL_USD,
  STANDARD_MONTHLY_USD,
  TEAMS_MANAGED_PER_SEAT_USD,
  TEAMS_SELF_SERVE_PER_SEAT_USD,
} from './site';

export type PricingTier = {
  id: string;
  name: string;
  priceUsd: number;
  cadence: 'monthly' | 'annual' | 'per-seat-monthly';
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  highlight?: boolean;
  status?: 'live' | 'coming_soon';
  badge?: string;
};

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'founders',
    name: "Founders'",
    priceUsd: FOUNDERS_TIER_PRICE_USD,
    cadence: 'monthly',
    description:
      "First 100 individual operators. Locked at $99/mo for 12 months. One-time, no replacements.",
    features: [
      'Every campus, every module',
      'Locked rate for 12 full months',
      'Direct line to Will for feedback',
      'First access to new campuses as they launch',
    ],
    ctaLabel: 'Claim a founders seat',
    ctaHref: '/?founders=1#waitlist',
    highlight: true,
    badge: 'Limited',
  },
  {
    id: 'individual',
    name: 'Individual',
    priceUsd: STANDARD_MONTHLY_USD,
    cadence: 'monthly',
    description: 'Standard monthly access for a single operator.',
    features: [
      'Every campus, every module',
      'AI deal simulations',
      'New content as it ships',
      'Cancel anytime',
    ],
    ctaLabel: 'Join the waitlist',
    ctaHref: '/#waitlist',
  },
  {
    id: 'annual',
    name: 'Annual',
    priceUsd: STANDARD_ANNUAL_USD,
    cadence: 'annual',
    description: 'Best value for solo operators committed to the year.',
    features: [
      'Two months free vs monthly',
      'Every campus, every module',
      'Priority support response',
      'Renew at the same rate as long as you stay subscribed',
    ],
    ctaLabel: 'Join the waitlist',
    ctaHref: '/#waitlist',
  },
  {
    id: 'bundle',
    name: 'Academy + SaaS Bundle',
    priceUsd: BUNDLE_MONTHLY_USD,
    cadence: 'monthly',
    description:
      'Academy training + DeskPilot SaaS in one subscription. Coming soon — waitlist now.',
    features: [
      'Everything in Individual',
      'DeskPilot SaaS — desking workspace, AI assistant, deal review',
      'Single seat across both products',
      'Founders bundle pricing reserved for current Academy members',
    ],
    ctaLabel: 'Get notified',
    ctaHref: '/#waitlist?source=bundle-interest',
    status: 'coming_soon',
    badge: 'Coming soon',
  },
];

export type TeamsTier = {
  id: string;
  name: string;
  perSeatUsd: number;
  seatRange: string;
  description: string;
  features: string[];
};

export const TEAMS_TIERS: TeamsTier[] = [
  {
    id: 'self-serve',
    name: 'Teams — Self-Serve',
    perSeatUsd: TEAMS_SELF_SERVE_PER_SEAT_USD,
    seatRange: '10–49 seats',
    description: 'For single rooftops and small groups. Onboard your team in minutes.',
    features: [
      'Team dashboard',
      'Per-seat invoicing',
      'Aggregate progress reporting',
      'Email + chat support',
    ],
  },
  {
    id: 'managed',
    name: 'Teams — Managed',
    perSeatUsd: TEAMS_MANAGED_PER_SEAT_USD,
    seatRange: '50+ seats',
    description:
      'For dealer groups. Managed rollout, success manager, and custom enablement.',
    features: [
      'Dedicated success manager',
      'Custom rollout plan per rooftop',
      'Quarterly business reviews',
      'SSO + admin controls',
    ],
  },
];
