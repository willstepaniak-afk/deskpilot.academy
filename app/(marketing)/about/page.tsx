import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/marketing/SectionHeading';
import { FacultyShowcase } from '@/components/marketing/FacultyShowcase';
import { JsonLd } from '@/components/seo/JsonLd';
import { Card } from '@/components/ui/card';

import { getAllFaculty } from '@/lib/faculty';
import { buildEducationalOrganizationLd, buildPersonLd, buildWebPageLd } from '@/lib/seo';
import { SITE } from '@/lib/site';

const URL = `${SITE.url}/about`;

export const metadata: Metadata = {
  title: 'About',
  description:
    'DeskPilot Academy is built by working dealership operators. Will Stepaniak founded it to close the gap between what operators actually do and what training products teach.',
  alternates: { canonical: URL },
};

export default async function AboutPage() {
  const faculty = await getAllFaculty();
  const will = faculty.find((m) => m.id === 'will-stepaniak');

  const jsonLd = [
    buildEducationalOrganizationLd(faculty),
    ...(will ? [buildPersonLd(will)] : []),
    buildWebPageLd({ url: URL, name: 'About', description: metadata.description as string }),
  ];

  return (
    <>
      <Container className="py-16 space-y-16">
        <section className="max-w-3xl">
          <SectionHeading
            eyebrow="About"
            title="An operator collective, not a training company."
            description="DeskPilot Academy is built by people who run the desk. We started because the gap between what operators actually do and what training products teach kept widening."
          />
        </section>

        {will && (
          <section>
            <Card className="p-8 max-w-4xl">
              <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-foreground">
                  {(will.name.split(' ').map((n) => n[0]).join('') || '').toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{will.name}</h2>
                  <p className="text-sm text-muted-foreground">{will.title}</p>
                  <p className="mt-4 text-base">{will.bio}</p>
                  <ul className="mt-4 flex flex-wrap gap-2 text-xs">
                    {will.expertise.map((e) => (
                      <li key={e} className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">
                        {e}
                      </li>
                    ))}
                  </ul>
                  {will.linkedinUrl && (
                    <a
                      href={will.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-block text-sm text-primary underline-offset-4 hover:underline"
                    >
                      Connect with {will.name.split(' ')[0]} on LinkedIn ↗
                    </a>
                  )}
                </div>
              </div>
            </Card>
          </section>
        )}

        <section>
          <SectionHeading
            title="The faculty we're building."
            description="Eight seats open. Each campus is led by an operator who runs that role at a dealership today — not consultants who left the floor a decade ago."
          />
          <div className="mt-10">
            <FacultyShowcase faculty={faculty} />
          </div>
        </section>

        <section className="max-w-3xl space-y-4 text-base text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground">Why operators</h2>
          <p>
            Every dealership has the same problem: training was written by people who haven&apos;t presented a menu, structured a deal, or held gross since the iPhone came out. The content is fine — the proximity to the floor is gone.
          </p>
          <p>
            DeskPilot Academy fixes that one decision at a time. Each campus is run by a person on a desk. Modules update as lender programs shift, compliance rules change, and the desk evolves. You learn from the people doing the work this week — not the one who wrote a book about it in 2014.
          </p>
          <p>
            We sell to individuals because individuals build careers. We sell to dealer groups because dealer groups build consistency. Same content, same operator point of view, two delivery models.
          </p>
        </section>
      </Container>
      <JsonLd data={jsonLd} />
    </>
  );
}
