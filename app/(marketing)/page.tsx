import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Hero } from '@/components/marketing/Hero';
import { OperatorCredibility } from '@/components/marketing/OperatorCredibility';
import { WhoThisIsFor } from '@/components/marketing/WhoThisIsFor';
import { CampusGrid } from '@/components/marketing/CampusGrid';
import { FeatureHighlights } from '@/components/marketing/FeatureHighlights';
import { FacultyShowcase } from '@/components/marketing/FacultyShowcase';
import { PricingTeaser } from '@/components/marketing/PricingTeaser';
import { FaqAccordion } from '@/components/marketing/FaqAccordion';
import { B2bTeaser } from '@/components/marketing/B2bTeaser';
import { FinalCta } from '@/components/marketing/FinalCta';
import { SectionHeading } from '@/components/marketing/SectionHeading';
import { JsonLd } from '@/components/seo/JsonLd';

import { getAllCampuses } from '@/lib/campuses';
import { getAllFaculty } from '@/lib/faculty';
import { getHomepageFaqs } from '@/lib/faqs';
import { buildFaqPageLd, buildProductLd } from '@/lib/seo';
import { LOCKED_META_DESCRIPTION } from '@/lib/copy';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: `${SITE.name} — Operator-Built Automotive Sales Training`,
  description: LOCKED_META_DESCRIPTION,
};

export default async function HomePage() {
  const [campuses, faculty, faqs] = await Promise.all([
    getAllCampuses(),
    getAllFaculty(),
    getHomepageFaqs(),
  ]);

  const featuredFaculty = faculty.slice(0, 3);

  const pageJsonLd = [buildProductLd(), buildFaqPageLd(faqs)];

  return (
    <>
      <Hero />
      <OperatorCredibility />

      <Container className="py-20 space-y-16">
        <section>
          <SectionHeading
            eyebrow="Who it's for"
            title="If you live at the desk, this is for you."
            description="Modern dealership training built for operators, not classrooms. F&I, sales, desking, fixed ops — the actual process, not the framework."
          />
          <div className="mt-10">
            <WhoThisIsFor />
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="The campuses"
            title="Nine campuses. One subscription."
            description="Two live at launch. Seven more in the pipeline with operator instructors recruited per campus."
          />
          <div className="mt-10">
            <CampusGrid campuses={campuses} />
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="What you get"
            title="Built the way operators actually learn."
          />
          <div className="mt-10">
            <FeatureHighlights />
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="The faculty"
            title="Operators teaching operators."
            description="One named lead instructor today. Seats are open for the rest — recruiting working operators per campus."
          />
          <div className="mt-10">
            <FacultyShowcase faculty={featuredFaculty} />
          </div>
        </section>

        <section id="pricing">
          <SectionHeading
            eyebrow="Pricing"
            title="Built for individual operators and dealer groups."
            description="Locked founders rate, standard monthly and annual, and per-seat team pricing for groups."
          />
          <div className="mt-10">
            <PricingTeaser />
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="FAQ" title="Most-asked questions." />
          <div className="mt-6">
            <FaqAccordion faqs={faqs} type="multiple" />
          </div>
        </section>

        <section>
          <B2bTeaser />
        </section>
      </Container>

      <FinalCta />

      <JsonLd data={pageJsonLd} />
    </>
  );
}
