export type FaqCategory =
  | 'general'
  | 'pricing'
  | 'product'
  | 'b2b'
  | 'founders'
  | 'roadmap';

export type Faq = {
  question: string;
  answer: string;
  category: FaqCategory;
  featuredOnHome?: boolean;
};

// TODO(Will): refine FAQ wording to match your voice — these are written in P1's tone.
const FAQS: Faq[] = [
  {
    question: 'Who is this for?',
    answer:
      'Working dealership operators — F&I managers, desk managers, sales managers, GSMs, and salespeople who want the actual process, not motivational content. If you live at the desk, this is for you.',
    category: 'general',
    featuredOnHome: true,
  },
  {
    question: 'Who builds the training?',
    answer:
      'Operators. Every campus is led by someone who runs that role at a dealership today. We do not use consultants who have not been at a desk in a decade.',
    category: 'general',
    featuredOnHome: true,
  },
  {
    question: 'How is this different from Pinnacle, NADA Academy, or JM&A training?',
    answer:
      'Three differences. First, every instructor is a working operator. Second, the format is on-demand video plus AI deal simulations, not week-long off-site classes. Third, the price is built for individual operators, not just dealer-paid enrollments.',
    category: 'general',
    featuredOnHome: true,
  },
  {
    question: 'What is launching first?',
    answer:
      'F&I Mastery and Sales Fundamentals are live at launch. Desking, Digital Retailing, Fixed Ops, Used Vehicle Ops, Management & Leadership, Compliance & Ethics, and Lender Intelligence are coming next — you can sign up to be notified per campus.',
    category: 'roadmap',
    featuredOnHome: true,
  },
  {
    question: 'How much does it cost?',
    answer:
      'Individual access is $199/month or $1,990/year. The first 100 individuals get founders pricing at $99/month, locked for 12 months. Teams start at $99 per seat per month for managed dealer-group rollouts and $179 per seat for self-serve.',
    category: 'pricing',
    featuredOnHome: true,
  },
  {
    question: 'What is founders pricing exactly?',
    answer:
      'The first 100 individual subscribers lock in $99/month for 12 months. After the cohort fills, standard pricing of $199/month applies. Founders pricing is one-time — if you cancel, you cannot reclaim the rate.',
    category: 'founders',
  },
  {
    question: 'Are the founders seats real or marketing scarcity?',
    answer:
      'Real. The counter reflects actual remaining founders seats, not a fake countdown. If the page shows 100 left, 100 are left. When the cohort fills, the offer ends.',
    category: 'founders',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes. Monthly subscriptions cancel anytime and run to the end of the period. Annual subscriptions are non-refundable after the first 7 days but do not auto-renew without notice.',
    category: 'pricing',
  },
  {
    question: 'Do you offer a free trial?',
    answer:
      'Not at launch. Lead magnets — playbooks, checklists, sample modules — are free without a card. The paid product is intentionally priced for operators who are ready to invest in their craft.',
    category: 'pricing',
  },
  {
    question: 'What is the Academy + SaaS bundle?',
    answer:
      'DeskPilot is launching a SaaS desking workspace alongside the Academy. The bundle combines training and the working tool in a single subscription at $349/month. It is coming soon — join the waitlist to be notified.',
    category: 'roadmap',
  },
  {
    question: 'How does dealer-group pricing work?',
    answer:
      'Two tracks. Self-serve is $179 per seat per month for 10–49 seats — sign up online, invite your team, manage seats yourself. Managed is $99 per seat per month for 50+ seats and includes a success manager, custom rollout, and quarterly reviews.',
    category: 'b2b',
    featuredOnHome: true,
  },
  {
    question: 'Can I trial it for my dealer group before committing?',
    answer:
      'Yes. We run paid pilots for groups evaluating Academy across multiple rooftops. Contact us through the dealer inquiry form and we will scope the pilot together.',
    category: 'b2b',
  },
  {
    question: 'Do you offer SSO and admin controls?',
    answer:
      'SSO, admin roles, and per-rooftop reporting are in the managed tier. Self-serve gets a team dashboard and per-seat invoicing.',
    category: 'b2b',
  },
  {
    question: 'Will training be specific to my OEM or vendor stack?',
    answer:
      'Core training is OEM- and vendor-agnostic — the desk math, the menu, and the process work everywhere. Custom content for specific OEMs or DMS/CRM stacks is available for managed accounts.',
    category: 'b2b',
  },
  {
    question: 'How long does each campus take?',
    answer:
      'Most campuses run 8–20 hours of video plus reps in the AI deal simulator. Operators typically complete a campus over 2–6 weeks of part-time study, but you can run it as fast or slow as you want.',
    category: 'product',
  },
  {
    question: 'What is the AI deal simulator?',
    answer:
      'A practice environment where you walk through deal structures, menu presentations, and customer objections with an AI that pushes back the way a real customer would. It is built into every campus.',
    category: 'product',
  },
  {
    question: 'Do I get certified?',
    answer:
      'Yes. Completion of a campus earns a credential you can share on LinkedIn or with your manager. Certifications are not a regulatory license — they are a record of completed coursework.',
    category: 'product',
  },
  {
    question: 'How current is the content?',
    answer:
      'Living content. Operators update modules as lender programs, regulations, and market conditions change. Subscribers see updates automatically.',
    category: 'product',
  },
  {
    question: 'Will the content stay accurate as compliance rules change?',
    answer:
      'Compliance & Ethics is a dedicated campus that updates as federal and state rules change. We mark dated content with effective dates and revise affected modules when rules shift.',
    category: 'product',
  },
  {
    question: 'Is there live coaching?',
    answer:
      'Live coaching and office hours are planned for the post-launch roadmap. At launch, you get on-demand video, AI simulations, and async feedback from instructors.',
    category: 'roadmap',
  },
  {
    question: 'Will there be a community?',
    answer:
      'A members-only community is on the roadmap for Q3 of the launch year. We are intentionally not opening it before we have enough operators inside to make it useful.',
    category: 'roadmap',
  },
  {
    question: 'How do I contact the team?',
    answer:
      'Email will@deskpilot.academy or submit the dealer inquiry form. Will reads every dealer inquiry personally during the founders phase.',
    category: 'general',
  },
  {
    question: 'Is my payment information secure?',
    answer:
      'Yes. Payments are processed by Stripe — we never see or store your card details. The site runs on HTTPS and uses industry-standard data protection.',
    category: 'general',
  },
  {
    question: 'Where is DeskPilot Academy based?',
    answer:
      'The Academy is an online product, built and run by a US-based founding team. The product is available to dealerships and operators in the US and Canada at launch.',
    category: 'general',
  },
  {
    question: 'Will you offer content in Spanish or other languages?',
    answer:
      'Spanish is on the roadmap based on subscriber demand. If your group needs it, mention it on the dealer inquiry form and we will weight it in our planning.',
    category: 'roadmap',
  },
  {
    question: 'Do you partner with OEMs or compliance vendors?',
    answer:
      'Selective partnerships for managed accounts. We do not white-label content for vendors who would dilute the operator point of view that makes the Academy useful.',
    category: 'b2b',
  },
  {
    question: 'How do refunds work?',
    answer:
      'Monthly: cancel anytime, no refund for the current month. Annual: 7-day money-back, no questions asked. After 7 days, annual subscriptions are non-refundable but do not auto-renew.',
    category: 'pricing',
  },
  {
    question: 'Can I expense Academy through my dealership?',
    answer:
      'Yes. We can invoice your dealership for annual or team plans directly. Use the dealer inquiry form and note that you need invoicing rather than card billing.',
    category: 'pricing',
  },
];

export async function getAllFaqs(): Promise<Faq[]> {
  return FAQS;
}

export async function getHomepageFaqs(): Promise<Faq[]> {
  return FAQS.filter((f) => f.featuredOnHome);
}

export async function getFaqsByCategory(category: FaqCategory): Promise<Faq[]> {
  return FAQS.filter((f) => f.category === category);
}

export async function getPricingFaqs(): Promise<Faq[]> {
  return FAQS.filter((f) => f.category === 'pricing' || f.category === 'founders');
}

export async function getB2bFaqs(): Promise<Faq[]> {
  return FAQS.filter((f) => f.category === 'b2b');
}
