import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/marketing/SectionHeading';
import { ResourceRequestDialog, type Resource } from '@/components/marketing/ResourceRequestDialog';
import { JsonLd } from '@/components/seo/JsonLd';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buildWebPageLd } from '@/lib/seo';
import { SITE } from '@/lib/site';

const URL = `${SITE.url}/free-resources`;

export const metadata: Metadata = {
  title: 'Free Resources',
  description:
    'Operator-built playbooks, checklists, and templates from DeskPilot Academy — free, email-gated. No card, no spam.',
  alternates: { canonical: URL },
};

const RESOURCES: Resource[] = [
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
          title="Operator playbooks, on the house."
          description="Email-gated, but free. Five resources at launch, more on the way."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((r) => (
            <li key={r.slug}>
              <Card className="h-full p-5 flex flex-col">
                {r.badge && (
                  <Badge variant="outline" className="self-start mb-3">
                    {r.badge}
                  </Badge>
                )}
                <h3 className="text-lg font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground flex-1">{r.description}</p>
                <div className="mt-5">
                  <ResourceRequestDialog resource={r} />
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
      <JsonLd data={jsonLd} />
    </>
  );
}
