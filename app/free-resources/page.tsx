import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/marketing/SectionHeading';
import { LeadMagnetCard, type LeadMagnet } from '@/components/marketing/LeadMagnetCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildWebPageLd } from '@/lib/seo';
import { SITE } from '@/lib/site';

const URL = `${SITE.url}/free-resources`;

export const metadata: Metadata = {
  title: 'Free Resources',
  description:
    'Operator-built playbooks, checklists, and templates from DeskPilot Academy. Coming soon — drop your email to be notified the moment each one is ready.',
  alternates: { canonical: URL },
};

const RESOURCES: LeadMagnet[] = [
  {
    slug: 'fi-menu-cheatsheet',
    title: 'F&I Menu Cheatsheet',
    description: 'A one-page reference for menu math, product tiers, and the close — the layout we use at the desk.',
    badge: 'F&I',
  },
  {
    slug: 'objection-tree-pack',
    title: 'Objection Tree Pack',
    description: 'Eight printable objection trees covering the most common F&I and sales pushback. Drop on the desk.',
    badge: 'F&I + Sales',
  },
  {
    slug: 'desking-payment-grid',
    title: 'Desking Payment Grid',
    description: 'The math worksheet for trade-down, leasing pivots, and structuring deals at the desk.',
    badge: 'Desking',
  },
  {
    slug: 'compliance-quickref',
    title: 'Compliance Quick Reference',
    description: 'Federal and state highlights — TILA, Reg Z, Reg B, ECOA, and the high-impact items operators get bit on.',
    badge: 'Compliance',
  },
  {
    slug: 'manager-1-1-template',
    title: 'Manager 1:1 Template',
    description: 'A 30-minute weekly 1:1 framework for sales managers and F&I directors. Real coaching, not status.',
    badge: 'Management',
  },
];

export default function FreeResourcesPage() {
  const jsonLd = buildWebPageLd({ url: URL, name: 'Free Resources', description: metadata.description as string });
  return (
    <>
      <Container className="py-16 space-y-12">
        <SectionHeading
          eyebrow="Free resources"
          title="Operator playbooks, on the way."
          description="Five playbooks in production. Drop your email on the one you want first and we will send it the moment it ships."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((r) => (
            <li key={r.slug}>
              <LeadMagnetCard resource={r} />
            </li>
          ))}
        </ul>
      </Container>
      <JsonLd data={jsonLd} />
    </>
  );
}
