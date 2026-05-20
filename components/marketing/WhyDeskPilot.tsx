import { Card } from '@/components/ui/card';

const POINTS = [
  {
    title: 'Built by operators, not consultants',
    body: 'Every campus is led by someone who runs that role at a dealership today. The Academy is an operator collective — instructors stay on the floor, so the playbook stays current with how deals actually get done this week.',
  },
  {
    title: 'The actual desk process',
    body: "Not motivational content. Not theory. The Academy teaches the desk math, the menu mechanics, the lender conversations, and the structures that hold gross. It is the work, broken down by the people doing it.",
  },
  {
    title: '$199/month, all-access',
    body: "One subscription, every campus, every module, every update. No course-by-course pricing. No upsells to unlock the part you actually needed. Founders pricing reduces that to $99/mo for 12 months for the first 100 operators.",
  },
  {
    title: 'Certifications you can use',
    body: 'Every campus you complete earns a credential you can share on LinkedIn or attach to a performance review. Certifications are a record of completed work — useful when promotion conversations come up.',
  },
];

export function WhyDeskPilot() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {POINTS.map((p) => (
        <li key={p.title}>
          <Card className="h-full p-6">
            <h3 className="text-lg font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.body}</p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
