import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/marketing/SectionHeading';
import { CampusInterestForm } from '@/components/marketing/CampusInterestForm';
import { JsonLd } from '@/components/seo/JsonLd';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { getAllCampuses, getCampusBySlug, type Campus } from '@/lib/campuses';
import { buildBreadcrumbLd, buildCourseLd, buildWebPageLd } from '@/lib/seo';
import { SITE } from '@/lib/site';

export async function generateStaticParams() {
  const campuses = await getAllCampuses();
  return campuses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const campus = await getCampusBySlug(slug);
  if (!campus) return { title: 'Campus not found' };
  const url = `${SITE.url}/campuses/${campus.slug}`;
  return {
    title: campus.name,
    description: campus.description,
    alternates: { canonical: url },
  };
}

export default async function CampusDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campus = await getCampusBySlug(slug);
  if (!campus) notFound();

  const url = `${SITE.url}/campuses/${campus.slug}`;
  const breadcrumbs = buildBreadcrumbLd([
    { name: 'Home', url: SITE.url },
    { name: 'Campuses', url: `${SITE.url}/campuses` },
    { name: campus.name, url },
  ]);
  const pageLd = buildWebPageLd({ url, name: campus.name, description: campus.description });

  return (
    <>
      <Container className="py-16 space-y-12">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <Link href="/campuses" className="hover:text-foreground">Campuses</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{campus.name}</span>
        </nav>

        <header className="max-w-3xl">
          <div className="flex items-center gap-3 mb-3">
            {campus.status === 'live' ? (
              <Badge variant="success">Live</Badge>
            ) : (
              <Badge variant="outline">Coming soon</Badge>
            )}
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Campus</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{campus.name}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{campus.tagline}</p>
          <p className="mt-5 text-base">{campus.description}</p>
        </header>

        {campus.status === 'live' ? <LiveCampusView campus={campus} /> : <ComingSoonCampusView campus={campus} />}
      </Container>

      <JsonLd
        data={campus.status === 'live' ? [breadcrumbs, ...buildCourseLd(campus), pageLd] : [breadcrumbs, pageLd]}
      />
    </>
  );
}

function LiveCampusView({ campus }: { campus: Campus }) {
  const totalLessons = campus.courseList.reduce((s, m) => s + m.lessonCount, 0);
  return (
    <>
      <section>
        <SectionHeading
          title="Modules in this campus"
          description={`${campus.courseList.length} modules · ${totalLessons} lessons.`}
        />
        <ol className="mt-8 space-y-3">
          {campus.courseList.map((m, i) => (
            <li key={m.title}>
              <Card className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Module {String(i + 1).padStart(2, '0')}</p>
                    <h3 className="mt-1 text-lg font-semibold">{m.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{m.summary}</p>
                  </div>
                  <Badge variant="outline">{m.lessonCount} lessons</Badge>
                </div>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold">Ready to start with {campus.shortName}?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Founders pricing still open. Join the waitlist to lock the rate.
              </p>
            </div>
            <Button asChild variant="accent" size="lg">
              <Link href="/#waitlist">Claim a founders seat</Link>
            </Button>
          </div>
        </Card>
      </section>
    </>
  );
}

function ComingSoonCampusView({ campus }: { campus: Campus }) {
  return (
    <section>
      <Card className="p-8">
        <h3 className="text-xl font-semibold">{campus.name} is in the build queue.</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          We are recruiting the operator who will lead this campus. Drop your email and we&apos;ll notify you the day {campus.shortName} opens.
        </p>
        <div className="mt-6">
          <CampusInterestForm campusSlug={campus.slug} campusName={campus.name} />
        </div>
      </Card>
    </section>
  );
}
