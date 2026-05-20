import { Card } from '@/components/ui/card';

// Static ROI math — no interactivity in P1. Numbers are conservative
// illustrations, not projections.
const SCENARIOS = [
  {
    label: '20-rooftop group',
    seats: 100,
    pvr_lift: 50,
    deals_per_seat_per_month: 8,
    monthly_seat_cost: 99,
  },
  {
    label: 'Single rooftop',
    seats: 12,
    pvr_lift: 35,
    deals_per_seat_per_month: 10,
    monthly_seat_cost: 179,
  },
];

function format(n: number) {
  return n.toLocaleString('en-US');
}

export function RoiCalculator() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {SCENARIOS.map((s) => {
        const monthlyLift = s.seats * s.deals_per_seat_per_month * s.pvr_lift;
        const monthlyCost = s.seats * s.monthly_seat_cost;
        const monthlyNet = monthlyLift - monthlyCost;
        return (
          <Card key={s.label} className="p-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{s.label}</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex justify-between"><span>Seats</span><span>{format(s.seats)}</span></li>
              <li className="flex justify-between"><span>Deals / seat / month</span><span>{format(s.deals_per_seat_per_month)}</span></li>
              <li className="flex justify-between"><span>PVR lift assumed</span><span>${format(s.pvr_lift)}</span></li>
              <li className="flex justify-between"><span>Monthly seat cost</span><span>${format(s.monthly_seat_cost)}</span></li>
            </ul>
            <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-md bg-secondary p-3">
                <p className="text-muted-foreground">Gross lift / mo</p>
                <p className="mt-1 text-lg font-bold">${format(monthlyLift)}</p>
              </div>
              <div className="rounded-md bg-secondary p-3">
                <p className="text-muted-foreground">Academy cost / mo</p>
                <p className="mt-1 text-lg font-bold">${format(monthlyCost)}</p>
              </div>
              <div className="rounded-md bg-accent/15 p-3 border border-accent/40">
                <p className="text-muted-foreground">Net / mo</p>
                <p className="mt-1 text-lg font-bold text-accent">${format(monthlyNet)}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Illustration only. Your numbers depend on baseline PVR, deal volume, and rollout discipline.
            </p>
          </Card>
        );
      })}
    </div>
  );
}
