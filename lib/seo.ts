import type { Campus } from './campuses';
import type { FacultyMember } from './faculty';
import type { Faq } from './faqs';
import { PRICING_TIERS, TEAMS_TIERS, type PricingTier, type TeamsTier } from './pricing';
import { SITE } from './site';

export type JsonLd = Record<string, unknown>;

export function buildOrganizationLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE.url}/icon-512.png`,
      width: 512,
      height: 512,
    },
    telephone: SITE.officePhone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: SITE.supportEmail,
        telephone: SITE.officePhone,
        availableLanguage: ['English'],
      },
    ],
  };
}

export function buildEducationalOrganizationLd(faculty: FacultyMember[]): JsonLd {
  const namedFaculty = faculty.filter((m) => !m.tbd);
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${SITE.url}/#educational-organization`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    educationalCredentialAwarded: 'Campus Completion Credential',
    member: namedFaculty.map((m) => ({
      '@type': 'Person',
      '@id': `${SITE.url}/about#${m.id}`,
      name: m.name,
      jobTitle: m.title,
    })),
  };
}

export function buildWebsiteLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: { '@id': `${SITE.url}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildPersonLd(member: FacultyMember): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE.url}/about#${member.id}`,
    name: member.name,
    jobTitle: member.title,
    description: member.bio,
    worksFor: { '@id': `${SITE.url}/#organization` },
    knowsAbout: member.expertise,
    ...(member.linkedinUrl ? { sameAs: [member.linkedinUrl] } : {}),
  };
}

function priceWithCurrency(priceUsd: number, cadence: PricingTier['cadence']): JsonLd {
  const billingDuration =
    cadence === 'annual' ? 'P1Y' : cadence === 'per-seat-monthly' ? 'P1M' : 'P1M';
  return {
    '@type': 'UnitPriceSpecification',
    price: priceUsd,
    priceCurrency: 'USD',
    billingDuration,
    unitText: cadence === 'annual' ? 'YEAR' : 'MONTH',
  };
}

function tierToOffer(tier: PricingTier): JsonLd {
  return {
    '@type': 'Offer',
    name: tier.name,
    description: tier.description,
    price: tier.priceUsd,
    priceCurrency: 'USD',
    priceSpecification: priceWithCurrency(tier.priceUsd, tier.cadence),
    availability:
      tier.status === 'coming_soon'
        ? 'https://schema.org/PreOrder'
        : 'https://schema.org/InStock',
    url: `${SITE.url}/pricing`,
  };
}

function teamsTierToOffer(tier: TeamsTier): JsonLd {
  return {
    '@type': 'Offer',
    name: tier.name,
    description: `${tier.description} ${tier.seatRange}.`,
    price: tier.perSeatUsd,
    priceCurrency: 'USD',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: tier.perSeatUsd,
      priceCurrency: 'USD',
      unitText: 'MONTH',
      referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitText: 'seat' },
    },
    availability: 'https://schema.org/InStock',
    url: `${SITE.url}/for-dealers`,
  };
}

export function buildProductLd(): JsonLd {
  const offers: JsonLd[] = [
    ...PRICING_TIERS.map(tierToOffer),
    ...TEAMS_TIERS.map(teamsTierToOffer),
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE.url}/#product`,
    name: SITE.name,
    description: SITE.description,
    brand: { '@id': `${SITE.url}/#organization` },
    offers,
  };
}

export function buildFaqPageLd(faqs: Faq[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

export function buildCourseLd(campus: Campus): JsonLd[] {
  return campus.courseList.map((mod) => ({
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${campus.name} — ${mod.title}`,
    description: mod.summary,
    provider: { '@id': `${SITE.url}/#educational-organization` },
    educationalLevel: 'Professional',
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: `PT${mod.lessonCount}H`,
    },
    url: `${SITE.url}/campuses/${campus.slug}`,
  }));
}

export function buildBreadcrumbLd(items: { name: string; url: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildServiceLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE.url}/for-dealers#service`,
    name: 'DeskPilot Academy for Dealer Groups',
    serviceType: 'Automotive Dealership Training',
    provider: { '@id': `${SITE.url}/#organization` },
    areaServed: { '@type': 'Country', name: ['United States', 'Canada'] },
    description:
      'Operator-built dealership training for single rooftops and multi-rooftop groups. Managed rollouts, per-rooftop reporting, and dedicated success management.',
    offers: TEAMS_TIERS.map(teamsTierToOffer),
  };
}

export function buildWebPageLd(args: {
  url: string;
  name: string;
  description: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${args.url}#webpage`,
    url: args.url,
    name: args.name,
    description: args.description,
    isPartOf: { '@id': `${SITE.url}/#website` },
    publisher: { '@id': `${SITE.url}/#organization` },
  };
}
