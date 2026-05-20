import { Card } from '@/components/ui/card';
import { Briefcase, MessagesSquare, ClipboardCheck, BookOpen } from 'lucide-react';

const FEATURES = [
  {
    icon: Briefcase,
    title: 'Built by working operators',
    body: 'Every campus is led by someone who runs that role at a dealership today — not consultants who left the floor a decade ago.',
  },
  {
    icon: MessagesSquare,
    title: 'AI deal simulations',
    body: 'Practice menu presentations, objections, and deal structures with an AI that pushes back the way a real customer does.',
  },
  {
    icon: ClipboardCheck,
    title: 'On-demand, on your schedule',
    body: 'Stream from anywhere. Most operators finish a campus in 2–6 weeks of part-time study — at your pace, not a hotel ballroom’s.',
  },
  {
    icon: BookOpen,
    title: 'Updated as the desk changes',
    body: 'Lender programs shift. Compliance rules change. Modules update with effective dates, so what you learn is what works now.',
  },
];

export function FeatureHighlights() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {FEATURES.map((f) => (
        <li key={f.title}>
          <Card className="h-full p-5">
            <f.icon className="h-6 w-6 text-primary" aria-hidden="true" />
            <h3 className="mt-3 text-base font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
