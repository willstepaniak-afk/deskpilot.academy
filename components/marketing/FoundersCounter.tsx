'use client';

import * as React from 'react';
import { FOUNDERS_B2B_TOTAL, FOUNDERS_INDIVIDUAL_TOTAL } from '@/lib/site';

type CounterShape = {
  founders_individual_remaining: number;
  founders_b2b_remaining: number;
};

const FALLBACK: CounterShape = {
  founders_individual_remaining: FOUNDERS_INDIVIDUAL_TOTAL,
  founders_b2b_remaining: FOUNDERS_B2B_TOTAL,
};

export function FoundersCounter({ initial }: { initial?: CounterShape }) {
  const [state, setState] = React.useState<CounterShape>(initial ?? FALLBACK);

  React.useEffect(() => {
    let cancelled = false;
    fetch('/api/counters', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: CounterShape | null) => {
        if (!cancelled && data) setState(data);
      })
      .catch(() => {
        // keep current state — never invent numbers
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid gap-3 sm:grid-cols-2 max-w-xl">
      <CounterCard
        label="Individual founders seats remaining"
        remaining={state.founders_individual_remaining}
        total={FOUNDERS_INDIVIDUAL_TOTAL}
        sublabel="$99/mo for 12 months — locked"
      />
      <CounterCard
        label="Dealer-group founder slots"
        remaining={state.founders_b2b_remaining}
        total={FOUNDERS_B2B_TOTAL}
        sublabel="Custom pricing — talk to us"
      />
    </div>
  );
}

function CounterCard({
  label,
  remaining,
  total,
  sublabel,
}: {
  label: string;
  remaining: number;
  total: number;
  sublabel: string;
}) {
  const safe = Math.max(0, Math.min(remaining, total));
  const pct = Math.round(((total - safe) / total) * 100);
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold">
          <span className="text-accent">{safe}</span>
          <span className="text-muted-foreground"> / {total}</span>
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{sublabel}</p>
    </div>
  );
}
