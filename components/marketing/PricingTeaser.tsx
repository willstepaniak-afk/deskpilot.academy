import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import {
  FOUNDERS_TIER_PRICE_USD,
  STANDARD_ANNUAL_USD,
  STANDARD_MONTHLY_USD,
  TEAMS_MANAGED_PER_SEAT_USD,
} from '@/lib/site';

export function PricingTeaser() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6 border-accent/40">
        <p className="text-xs uppercase tracking-wide text-accent font-semibold">Founders</p>
        <p className="mt-2 text-3xl font-bold">${FOUNDERS_TIER_PRICE_USD}<span className="text-base font-normal text-muted-foreground">/mo</span></p>
        <p className="mt-1 text-sm text-muted-foreground">Locked 12 months. First 100 operators only.</p>
        <ul className="mt-4 space-y-2 text-sm">
          <li className="flex gap-2"><Check className="h-4 w-4 text-success mt-0.5 shrink-0" />Every campus, every module</li>
          <li className="flex gap-2"><Check className="h-4 w-4 text-success mt-0.5 shrink-0" />Direct line to Will</li>
        </ul>
      </Card>
      <Card className="p-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Individual</p>
        <p className="mt-2 text-3xl font-bold">${STANDARD_MONTHLY_USD}<span className="text-base font-normal text-muted-foreground">/mo</span></p>
        <p className="mt-1 text-sm text-muted-foreground">Or ${STANDARD_ANNUAL_USD}/yr — two months free.</p>
        <ul className="mt-4 space-y-2 text-sm">
          <li className="flex gap-2"><Check className="h-4 w-4 text-success mt-0.5 shrink-0" />Every campus, every module</li>
          <li className="flex gap-2"><Check className="h-4 w-4 text-success mt-0.5 shrink-0" />Cancel anytime</li>
        </ul>
      </Card>
      <Card className="p-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Teams</p>
        <p className="mt-2 text-3xl font-bold">from ${TEAMS_MANAGED_PER_SEAT_USD}<span className="text-base font-normal text-muted-foreground">/seat/mo</span></p>
        <p className="mt-1 text-sm text-muted-foreground">Self-serve from 10 seats. Managed at 50+.</p>
        <ul className="mt-4 space-y-2 text-sm">
          <li className="flex gap-2"><Check className="h-4 w-4 text-success mt-0.5 shrink-0" />Team dashboard + reporting</li>
          <li className="flex gap-2"><Check className="h-4 w-4 text-success mt-0.5 shrink-0" />Managed rollout at scale</li>
        </ul>
      </Card>
      <div className="md:col-span-3 flex flex-wrap gap-3">
        <Button asChild variant="accent" size="lg">
          <Link href="/pricing">See full pricing</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/for-dealers">For dealer groups</Link>
        </Button>
      </div>
    </div>
  );
}
