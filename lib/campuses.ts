export type CampusStatus = 'live' | 'coming_soon';

export type CampusModule = {
  title: string;
  lessonCount: number;
  summary: string;
};

export type Campus = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  status: CampusStatus;
  iconKey: string;
  // TODO(Will): confirm module titles and lesson counts
  courseList: CampusModule[];
};

const CAMPUSES: Campus[] = [
  {
    slug: 'f-i',
    name: 'F&I Mastery',
    shortName: 'F&I',
    tagline: 'The desk math, the menu, and the close.',
    description:
      'F&I taught by operators who actually present menus every day. Walk through the math, the menu mechanics, the objections, and the close — the way it really runs at the desk.',
    status: 'live',
    iconKey: 'briefcase',
    courseList: [
      {
        title: 'Foundations of F&I',
        lessonCount: 6,
        summary: 'The role of F&I, profit math, and how the dealership actually makes money on a car.',
      },
      {
        title: 'Menu Presentation',
        lessonCount: 8,
        summary: 'Building, presenting, and pivoting on menus that convert without manipulation.',
      },
      {
        title: 'Objection Handling',
        lessonCount: 10,
        summary: 'Live objection trees for every product, every customer type, every situation.',
      },
      {
        title: 'Compliance & Ethics',
        lessonCount: 5,
        summary: 'The lines you do not cross. Federal and state rules that protect you and the store.',
      },
      {
        title: 'Lender Intelligence',
        lessonCount: 7,
        summary: 'Reading lender programs, structuring deals, and getting tough deals bought.',
      },
      {
        title: 'Product Knowledge — VSC, GAP, and Beyond',
        lessonCount: 9,
        summary: 'What every aftermarket product actually does, who it fits, and how to explain it.',
      },
      {
        title: 'Desk-to-F&I Handoff',
        lessonCount: 4,
        summary: 'Turning a clean handoff into a higher PVR. Working with the desk, not against it.',
      },
      {
        title: 'Live Deal Reviews',
        lessonCount: 6,
        summary: 'Real anonymized deals broken down line by line — what worked, what to do next time.',
      },
    ],
  },
  {
    slug: 'sales',
    name: 'Sales Fundamentals',
    shortName: 'Sales',
    tagline: 'The road to the sale, rebuilt for today.',
    description:
      'Modern showroom sales without the 1990s playbook. Phone, internet, lot up — the entire process operators actually use to close cars at gross.',
    status: 'live',
    iconKey: 'users',
    // TODO(Will): confirm module titles and lesson counts
    courseList: [
      {
        title: 'The Modern Road to the Sale',
        lessonCount: 7,
        summary: 'Greeting, qualifying, and selecting the vehicle without manipulation.',
      },
      {
        title: 'Phone & Internet Mastery',
        lessonCount: 8,
        summary: 'Setting the appointment from text, chat, and inbound calls.',
      },
      {
        title: 'The Walkaround That Actually Works',
        lessonCount: 5,
        summary: 'Feature-benefit walkarounds tied to the customer, not the script.',
      },
      {
        title: 'Demo Drives & Trial Closes',
        lessonCount: 4,
        summary: 'The drive as a sales tool — handling the conversation, reading the cues.',
      },
      {
        title: 'Negotiation Without Games',
        lessonCount: 6,
        summary: 'Holding gross without burning the customer. The mechanics of trade and payment.',
      },
      {
        title: 'Closing & Delivery',
        lessonCount: 5,
        summary: 'Locking the deal, the F&I handoff, and the delivery that drives CSI.',
      },
    ],
  },
  {
    slug: 'desking',
    name: 'Desking & Deal Structure',
    shortName: 'Desking',
    tagline: 'The desk seat — operator-level structuring.',
    description:
      'The desk is where deals are made or lost. Structuring, payment math, trade walks, and the calls that bend a deal back together.',
    status: 'coming_soon',
    iconKey: 'calculator',
    courseList: [],
  },
  {
    slug: 'digital-retailing',
    name: 'Digital Retailing',
    shortName: 'Digital Retail',
    tagline: 'Selling online without losing the deal.',
    description:
      'How modern dealerships handle leads, online price quotes, online deal jackets, and digital paperwork without leaking profit.',
    status: 'coming_soon',
    iconKey: 'monitor',
    courseList: [],
  },
  {
    slug: 'fixed-ops',
    name: 'Fixed Ops',
    shortName: 'Fixed Ops',
    tagline: 'Service drive economics and customer retention.',
    description:
      'The other half of the dealership. Service advisor process, ROs, retention math, and how fixed ops funds the variable side.',
    status: 'coming_soon',
    iconKey: 'wrench',
    courseList: [],
  },
  {
    slug: 'used-vehicle-ops',
    name: 'Used Vehicle Ops',
    shortName: 'Used Vehicle',
    tagline: 'Acquisition, recon, and the 60-day reality.',
    description:
      'Sourcing inventory, recon discipline, retail vs wholesale decisions, and the data behind a used vehicle department that actually makes money.',
    status: 'coming_soon',
    iconKey: 'car',
    courseList: [],
  },
  {
    slug: 'management-leadership',
    name: 'Management & Leadership',
    shortName: 'Management',
    tagline: 'Running the floor, not just the report.',
    description:
      'Sales manager, F&I director, GM — the people side of running a dealership. Coaching, performance, and the calls that define a culture.',
    status: 'coming_soon',
    iconKey: 'briefcase',
    courseList: [],
  },
  {
    slug: 'compliance-ethics',
    name: 'Compliance & Ethics',
    shortName: 'Compliance',
    tagline: 'The lines, the laws, and the why.',
    description:
      'Federal, state, and dealer-specific compliance. Not a CYA reading — the real situations that put deals and licenses at risk, and how operators handle them.',
    status: 'coming_soon',
    iconKey: 'shield',
    courseList: [],
  },
  {
    slug: 'lender-intelligence',
    name: 'Lender Intelligence',
    shortName: 'Lenders',
    tagline: 'Reading the lender behind the deal.',
    description:
      'Programs, advances, structures, and the conversations that get tough deals bought. The lender relationship that makes a desk hum.',
    status: 'coming_soon',
    iconKey: 'banknote',
    courseList: [],
  },
];

export async function getAllCampuses(): Promise<Campus[]> {
  return CAMPUSES;
}

export async function getCampusBySlug(slug: string): Promise<Campus | undefined> {
  return CAMPUSES.find((c) => c.slug === slug);
}

export async function getLiveCampuses(): Promise<Campus[]> {
  return CAMPUSES.filter((c) => c.status === 'live');
}

export async function getComingSoonCampuses(): Promise<Campus[]> {
  return CAMPUSES.filter((c) => c.status === 'coming_soon');
}

export function getComingSoonCampusSlugs(): string[] {
  return CAMPUSES.filter((c) => c.status === 'coming_soon').map((c) => c.slug);
}
