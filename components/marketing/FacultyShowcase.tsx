import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { FacultyMember } from '@/lib/faculty';
import { User } from 'lucide-react';

export function FacultyShowcase({ faculty }: { faculty: FacultyMember[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {faculty.map((m) => (
        <li key={m.id}>
          <Card className="h-full p-5">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-foreground"
                aria-hidden="true"
              >
                {m.tbd ? <User className="h-6 w-6 text-muted-foreground" /> : initials(m.name)}
              </div>
              <div>
                <p className="font-semibold leading-tight">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.title}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{m.bio}</p>
            {m.expertise.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {m.expertise.map((tag) => (
                  <li key={tag}>
                    <Badge variant="outline">{tag}</Badge>
                  </li>
                ))}
              </ul>
            )}
            {m.tbd && (
              <p className="mt-3 text-xs text-muted-foreground italic">
                Are you the operator who should be teaching this? Get in touch.
              </p>
            )}
          </Card>
        </li>
      ))}
    </ul>
  );
}

function initials(name: string) {
  return (
    <span className="text-sm font-semibold">
      {name
        .split(' ')
        .map((s) => s[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()}
    </span>
  );
}
