import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SITE } from '@/lib/site';

// Founder-credibility callout. Left-aligned inside the standard page Container
// (same max-w-6xl + gutters as the campus section) so the left edge lines up
// when scrolling between the two. Body paragraphs are capped at max-w-2xl for
// readability but stay left-aligned, not centered.
export function OperatorCredibility() {
  return (
    <section className="border-y border-border/60 bg-card/40 py-12">
      <Container>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Built by dealership operators
        </p>
        <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
          Operators who&apos;ve actually run the desks teaching them.
        </h2>
        <div className="mt-4 max-w-2xl space-y-4 text-base text-muted-foreground">
          <p>
            {SITE.founderName} spent 16+ years at Asbury Automotive Group, advancing through
            sales, F&I, management, and Regional Director of Financial Services across Florida,
            Georgia, and South Carolina. He&apos;s run the desk, the floor, the box, the service
            drive, the shop, and trained the operators who actually move and service the metal and
            deliver results.
          </p>
          <p>
            All faculty are being recruited to the same standard — battle-tested operators with
            equivalent real-world depth. No theorists. No consultants. Only people who&apos;ve run
            the P&L and know how to win.
          </p>
        </div>
        <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
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
      </Container>
    </section>
  );
}
