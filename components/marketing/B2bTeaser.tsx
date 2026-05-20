import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function B2bTeaser() {
  return (
    <Card className="p-8 sm:p-10 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">For dealer groups</p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold">
            Roll out a consistent process across every rooftop.
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Per-seat invoicing, team dashboards, and managed rollouts for groups with
            50+ seats. We run the enablement so your managers run the floor.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="accent" size="lg">
            <Link href="/for-dealers">Book a dealer call</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/for-dealers#pricing">See team pricing</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
