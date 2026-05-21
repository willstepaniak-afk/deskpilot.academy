import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SITE } from '@/lib/site';

// Replaces the placeholder dealer-logo strip with a founder-credibility
// callout. Occupies roughly the same vertical band (compact, single centered
// column) so the homepage rhythm is unchanged.
export function OperatorCredibility() {
  return (
    <section className="border-y border-border/60 bg-card/40 py-12">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Built by dealership operators
          </p>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
            Operators who&apos;ve actually run the desks teaching them.
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Founded by {SITE.founderName} — General Manager at Coggin Chevrolet at the Avenues,
            with 16+ years at Asbury Automotive Group across F&amp;I, desking, and multi-rooftop
            leadership. Former Regional Director of Financial Services for FL, GA, and SC. Faculty
            for other campuses being announced through 2026.
          </p>
          <p className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            <Link href="/about" className="text-primary underline-offset-4 hover:underline">
              About the operator collective →
            </Link>
            <a
              href={SITE.founderLinkedin}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              Will on LinkedIn ↗
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}
