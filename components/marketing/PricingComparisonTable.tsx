import { Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';

// TODO(Will): verify competitor features and pricing before launch
type Row = { feature: string; values: Array<boolean | string> };

const COLUMNS = ['DeskPilot Academy', 'Pinnacle', 'NADA Academy', 'JM&A'];

const ROWS: Row[] = [
  { feature: 'Operator-taught — instructors active at dealerships today', values: [true, false, false, false] },
  { feature: 'On-demand video — no hotel ballroom', values: [true, true, false, true] },
  { feature: 'AI deal simulations', values: [true, false, false, false] },
  { feature: 'Individual subscription pricing', values: [true, false, false, false] },
  { feature: 'Per-seat dealer-group plans', values: [true, true, true, true] },
  { feature: 'Compliance content updated as rules shift', values: [true, true, true, true] },
  { feature: 'Founders pricing for early operators', values: [true, false, false, false] },
];

export function PricingComparisonTable() {
  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/30 text-left">
            <th className="px-4 py-3 font-semibold">Feature</th>
            {COLUMNS.map((c, i) => (
              <th key={c} className={`px-4 py-3 font-semibold ${i === 0 ? 'text-accent' : ''}`}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.feature} className="border-b border-border last:border-0">
              <td className="px-4 py-3 font-medium">{row.feature}</td>
              {row.values.map((v, i) => (
                <td key={i} className="px-4 py-3">
                  {v === true ? (
                    <Check className="h-4 w-4 text-success" aria-label="Yes" />
                  ) : v === false ? (
                    <X className="h-4 w-4 text-muted-foreground" aria-label="No" />
                  ) : (
                    <span>{v}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-4 py-3 text-xs text-muted-foreground border-t border-border">
        Comparison reflects publicly available information as of launch. Last verified at deploy time.
      </p>
    </Card>
  );
}
