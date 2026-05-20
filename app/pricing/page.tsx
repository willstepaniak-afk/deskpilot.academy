import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/marketing/SectionHeading';
import { FoundersBanner } from '@/components/marketing/FoundersBanner';
import { PricingCard } from '@/components/marketing/PricingCard';
import { PricingComparisonTable } from '@/components/marketing/PricingComparisonTable';
import { FaqAccordion } from '@/components/marketing/FaqAccordion';
import { JsonLd } from '@/components/seo/JsonLd';

import { PRICING_TIERS, TEAMS_TIERS } from '@/lib/pricing';
import { getPricingFaqs } from '@/lib/faqs';
import { buildFaqPageLd, buildProductLd, buildWebPageLd } from '@/lib/seo';
import { SITE } from '@/lib/site';

const URL = `${SITE.url}/pricing`;

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'DeskPilot Academy pricing — founders rate at $99/mo (first 100 operators), standard at $199/mo or $1,990/yr, team plans from $99/seat, and the Academy + SaaS Bundle at $349/mo.',
  alternates: { canonical: URL },
};

export default async function PricingPage() {
  const faqs = await getPricingFaqs();
  const jsonLd = [
    buildProductLd(),
    buildFaqPageLd(faqs),
    buildWebPageLd({ url: URL, name: 'Pricing', description: metadata.description as string }),
  ];

  return (
    <>
      <Container className="py-16 space-y-16">
        <SectionHeading
          eyebrow="Pricing"
          title="Operator pricing. No theatre."
          description="Founders pricing is real and limited. Standard pricing is what it is. Teams scale by seat."
          align="center"
        />

        <FoundersBanner />

        <section>
          <ul className="grid gap-4 lg:grid-cols-4">
            {PRICING_TIERS.map((tier) => (
              <li key={tier.id}>
                <PricingCard tier={tier} />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionHeading title="Dealer-group plans" description="Per-seat pricing for 10+ seats." />
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {TEAMS_TIERS.map((t) => (
              <li key={t.id}>
                <div className="rounded-lg border border-border bg-card p-6 h-full">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-lg font-semibold">{t.name}</h3>
                    <span className="text-xs text-muted-foreground">{t.seatRange}</span>
                  </div>
                  <p className="mt-2 text-4xl font-bold">
                    ${t.perSeatUsd}
                    <span className="text-base font-normal text-muted-foreground">/seat/mo</span>
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
                  <ul className="mt-4 space-y-1 text-sm text-muted-foreground list-disc list-inside">
                    {t.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionHeading
            title="How we compare"
            description="Operator-built, on-demand, individual or team — at a price built for actual operators."
          />
          <div className="mt-8">
            <PricingComparisonTable />
          </div>
        </section>

        <section>
          <SectionHeading title="Pricing FAQ" />
          <div className="mt-6 max-w-3xl">
            <FaqAccordion faqs={faqs} type="single" />
          </div>
        </section>
      </Container>
      <JsonLd data={jsonLd} />
    </>
  );
}
