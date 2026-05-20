import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import type { PricingTier } from '@/lib/pricing';
import { cn } from '@/lib/utils';

export function PricingCard({ tier }: { tier: PricingTier }) {
  const isComingSoon = tier.status === 'coming_soon';
  return (
    <Card
      className={cn(
        'flex flex-col p-6 h-full',
        tier.highlight && 'border-accent ring-1 ring-accent/40',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold">{tier.name}</h3>
        {tier.badge && (
          <Badge variant={tier.highlight ? 'accent' : 'outline'}>{tier.badge}</Badge>
        )}
      </div>
      <p className="mt-4 text-4xl font-bold">
        ${tier.priceUsd.toLocaleString('en-US')}
        <span className="text-base font-normal text-muted-foreground">
          {tier.cadence === 'annual' ? '/yr' : '/mo'}
        </span>
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>
      <ul className="mt-5 space-y-2 text-sm flex-1">
        {tier.features.map((f) => (
          <li key={f} className="flex gap-2">
            <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Button
          asChild
          variant={tier.highlight ? 'accent' : isComingSoon ? 'outline' : 'default'}
          size="lg"
          className="w-full"
        >
          <Link href={tier.ctaHref}>{tier.ctaLabel}</Link>
        </Button>
      </div>
    </Card>
  );
}
