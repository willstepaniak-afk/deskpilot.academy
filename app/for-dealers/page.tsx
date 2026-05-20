import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/marketing/SectionHeading';
import { RoiCalculator } from '@/components/marketing/RoiCalculator';
import { B2bInquiryForm } from '@/components/marketing/B2bInquiryForm';
import { FaqAccordion } from '@/components/marketing/FaqAccordion';
import { JsonLd } from '@/components/seo/JsonLd';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { TEAMS_TIERS } from '@/lib/pricing';
import { getB2bFaqs } from '@/lib/faqs';
import { buildFaqPageLd, buildServiceLd, buildWebPageLd } from '@/lib/seo';
import { SITE } from '@/lib/site';

const URL = `${SITE.url}/for-dealers`;

export const metadata: Metadata = {
  title: 'For Dealer Groups',
  description:
    'Roll out a consistent dealership training process across every rooftop. Per-seat invoicing, team dashboards, managed enablement at 50+ seats — from $99/seat managed and $179/seat self-serve.',
  alternates: { canonical: URL },
};

export default async function ForDealersPage() {
  const faqs = await getB2bFaqs();
  const jsonLd = [
    buildServiceLd(),
    buildFaqPageLd(faqs),
    buildWebPageLd({ url: URL, name: 'For Dealer Groups', description: metadata.description as string }),
  ];

  return (
    <>
      <Container className="py-16 space-y-16">
        <section className="max-w-3xl">
          <SectionHeading
            eyebrow="For dealer groups"
            title="One process. Every rooftop. Every seat."
            description="Roll out operator-built training across your group with per-seat invoicing, team dashboards, and managed rollouts at scale."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="accent" size="lg">
              <Link href="#inquiry">Book a dealer call</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#pricing">See team pricing</Link>
            </Button>
          </div>
        </section>

        <section>
          <SectionHeading title="What it could mean for your group" />
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
            Two illustrative scenarios. Replace the assumptions with your group&apos;s actual baseline and you&apos;ll have a usable model.
          </p>
          <div className="mt-8">
            <RoiCalculator />
          </div>
        </section>

        <section id="pricing">
          <SectionHeading title="Team pricing" description="Per-seat plans for 10+ seats." />
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {TEAMS_TIERS.map((t) => (
              <li key={t.id}>
                <Card className="p-6 h-full">
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
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section id="inquiry">
          <SectionHeading
            title="Talk to us"
            description="Will reads every dealer inquiry personally during the founders phase."
          />
          <div className="mt-8 max-w-3xl">
            <B2bInquiryForm />
          </div>
        </section>

        <section>
          <SectionHeading title="Dealer FAQ" />
          <div className="mt-6 max-w-3xl">
            <FaqAccordion faqs={faqs} type="single" />
          </div>
        </section>
      </Container>
      <JsonLd data={jsonLd} />
    </>
  );
}
