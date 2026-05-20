import { z } from 'zod';
import { getComingSoonCampusSlugs } from './campuses';

export const waitlistSchema = z.object({
  email: z.string().email(),
  source: z.string().min(1).max(80),
  founders_tier_interest: z.boolean().optional().default(false),
});

export const b2bInquirySchema = z.object({
  full_name: z.string().min(1).max(120),
  email: z.string().email(),
  dealer_group: z.string().min(1).max(160),
  role: z.string().min(1).max(80),
  rooftops: z.coerce.number().int().min(1).max(2000),
  estimated_seats: z.coerce.number().int().min(1).max(50000),
  message: z.string().max(2000).optional().default(''),
  source: z.string().min(1).max(80),
  // honeypot — anything non-empty triggers silent acceptance in the route.
  // schema accepts any string so we can detect-and-drop without leaking signal.
  website: z.string().max(2000).optional().default(''),
});

export const resourceSchema = z.object({
  email: z.string().email(),
  resource_slug: z.string().min(1).max(80),
});

const COMING_SOON_SLUGS = new Set(getComingSoonCampusSlugs());

export const campusInterestSchema = z.object({
  email: z.string().email(),
  campus_slug: z.string().refine((slug) => COMING_SOON_SLUGS.has(slug), {
    message: 'Invalid campus slug',
  }),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
export type B2bInquiryInput = z.infer<typeof b2bInquirySchema>;
export type ResourceInput = z.infer<typeof resourceSchema>;
export type CampusInterestInput = z.infer<typeof campusInterestSchema>;
