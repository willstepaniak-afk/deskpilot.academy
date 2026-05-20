import { Card } from '@/components/ui/card';

const AUDIENCES = [
  {
    title: 'F&I managers',
    body: 'You present menus every shift. You want sharper objection trees and PVR that holds when the lender pushes back.',
  },
  {
    title: 'Sales managers & desk managers',
    body: 'You run the desk. You want a process the whole floor can follow without losing gross to inconsistency.',
  },
  {
    title: 'Salespeople going pro',
    body: 'You want to be the operator the GM trusts with the tough deals — not the script-reader.',
  },
  {
    title: 'GMs & dealer principals',
    body: 'You want your floor trained on a consistent process without burning weeks of payroll in a hotel ballroom.',
  },
];

export function WhoThisIsFor() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {AUDIENCES.map((a) => (
        <li key={a.title}>
          <Card className="h-full p-5">
            <h3 className="text-base font-semibold">{a.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{a.body}</p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
