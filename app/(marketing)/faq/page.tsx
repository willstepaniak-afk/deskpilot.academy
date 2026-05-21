import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/marketing/SectionHeading';
import { FaqAccordion } from '@/components/marketing/FaqAccordion';
import { JsonLd } from '@/components/seo/JsonLd';
import { getAllFaqs, type FaqCategory } from '@/lib/faqs';
import { buildFaqPageLd, buildWebPageLd } from '@/lib/seo';
import { SITE } from '@/lib/site';

const URL = `${SITE.url}/faq`;

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about DeskPilot Academy — pricing, founders cohort, dealer-group plans, product, and roadmap.',
  alternates: { canonical: URL },
};

const ORDER: { category: FaqCategory; label: string }[] = [
  { category: 'general', label: 'General' },
  { category: 'pricing', label: 'Pricing' },
  { category: 'founders', label: 'Founders pricing' },
  { category: 'product', label: 'Product' },
  { category: 'b2b', label: 'Dealer groups' },
  { category: 'roadmap', label: 'Roadmap' },
];

export default async function FaqPage() {
  const faqs = await getAllFaqs();
  const jsonLd = [
    buildFaqPageLd(faqs),
    buildWebPageLd({ url: URL, name: 'FAQ', description: metadata.description as string }),
  ];

  return (
    <>
      <Container className="py-16 space-y-12">
        <SectionHeading
          eyebrow="FAQ"
          title="Everything we get asked."
          description="If a question is missing, email will@deskpilot.academy and we'll add it."
        />

        <div className="grid gap-12">
          {ORDER.map(({ category, label }) => {
            const items = faqs.filter((f) => f.category === category);
            if (items.length === 0) return null;
            return (
              <section key={category}>
                <h2 className="text-2xl font-semibold mb-4">{label}</h2>
                <FaqAccordion faqs={items} type="multiple" />
              </section>
            );
          })}
        </div>
      </Container>
      <JsonLd data={jsonLd} />
    </>
  );
}
