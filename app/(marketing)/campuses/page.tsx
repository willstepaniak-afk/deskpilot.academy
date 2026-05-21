import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/marketing/SectionHeading';
import { CampusFilterTabs } from '@/components/marketing/CampusFilterTabs';
import { JsonLd } from '@/components/seo/JsonLd';
import { getAllCampuses } from '@/lib/campuses';
import { buildWebPageLd } from '@/lib/seo';
import { SITE } from '@/lib/site';

const URL = `${SITE.url}/campuses`;

export const metadata: Metadata = {
  title: 'Campuses',
  description:
    'Nine campuses covering F&I, sales, desking, digital retailing, fixed ops, used vehicle ops, management, compliance, and lender intelligence. Two live at launch.',
  alternates: { canonical: URL },
};

export default async function CampusesPage() {
  const campuses = await getAllCampuses();
  const jsonLd = buildWebPageLd({
    url: URL,
    name: 'Campuses',
    description: metadata.description as string,
  });

  return (
    <>
      <Container className="py-16">
        <SectionHeading
          eyebrow="The campuses"
          title="A campus for every desk."
          description="Operator-led. Module-based. Two live at launch, with the rest opening as the operators leading them step up."
        />
        <div className="mt-10">
          <CampusFilterTabs campuses={campuses} />
        </div>
      </Container>
      <JsonLd data={jsonLd} />
    </>
  );
}
