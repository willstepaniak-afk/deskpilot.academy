import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/layout/Container';
import { LOCKED_H1, LOCKED_SUBHEAD } from '@/lib/copy';
import { FoundersCounter } from './FoundersCounter';
import { WaitlistForm } from './WaitlistForm';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-30 [mask-image:radial-gradient(ellipse_at_top,black,transparent_60%)]"
        aria-hidden="true"
      >
        <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_50%_0,hsl(var(--primary)/0.35),transparent_70%)]" />
      </div>
      <Container className="relative py-20 sm:py-28" id="waitlist">
        <div className="max-w-3xl">
          <Badge variant="outline" className="mb-5">
            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse-glow" />
            Operator-built. Pre-launch.
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            {LOCKED_H1}
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-muted-foreground max-w-2xl">
            {LOCKED_SUBHEAD}
          </p>
          <div className="mt-8 space-y-6 max-w-xl">
            <WaitlistForm source="hero" foundersTier buttonLabel="Claim a founders seat" />
            <FoundersCounter />
            <p className="text-xs text-muted-foreground">
              Real numbers. The counter reflects actual remaining founders seats —
              not a fake countdown.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="ghost" size="lg">
              <Link href="/campuses">See the campuses →</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/for-dealers">For dealer groups</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
