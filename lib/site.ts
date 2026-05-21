export const SITE = {
  name: 'DeskPilot Academy',
  shortName: 'DeskPilot',
  domain: 'deskpilot.academy',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://deskpilot.academy',
  twitter: '@deskpilotacad',
  founderName: 'Will Stepaniak',
  founderTitle: 'Founder & Lead Instructor',
  founderUrl: 'https://deskpilot.academy/about',
  founderLinkedin: 'https://www.linkedin.com/in/will-stepaniak-b6bba01b/',
  contactEmail: 'will@deskpilot.academy',
  supportEmail: 'support@deskpilot.academy',
  description:
    'Operator-built automotive dealership training. The desk process — F&I, sales, desking, used-vehicle ops, fixed ops, and more — taught by working dealership operators, not consultants.',
  ogDescription:
    'Operator-level automotive sales training. Not theory — the actual desk process.',
} as const;

export const BANNED_PHRASES = [
  'transform',
  'revolutionary',
  'game-changing',
  'next-level',
  'unlock your potential',
] as const;

export const STATIC_ROUTES = [
  '/',
  '/pricing',
  '/for-dealers',
  '/campuses',
  '/faq',
  '/about',
  '/free-resources',
  '/privacy',
  '/terms',
] as const;

export const FOUNDERS_TIER_PRICE_USD = 99;
export const STANDARD_MONTHLY_USD = 199;
export const STANDARD_ANNUAL_USD = 1990;
export const TEAMS_SELF_SERVE_PER_SEAT_USD = 179;
export const TEAMS_MANAGED_PER_SEAT_USD = 99;
export const BUNDLE_MONTHLY_USD = 349;
export const FOUNDERS_INDIVIDUAL_TOTAL = 100;
export const FOUNDERS_B2B_TOTAL = 10;
