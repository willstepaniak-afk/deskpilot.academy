import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Campus } from '@/lib/campuses';

export function CampusGrid({ campuses }: { campuses: Campus[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {campuses.map((c) => (
        <li key={c.slug}>
          <Link
            href={`/campuses/${c.slug}`}
            className="block focus:outline-none focus:ring-2 focus:ring-ring rounded-lg"
          >
            <Card className="h-full p-5 hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold">{c.name}</h3>
                {c.status === 'live' ? (
                  <Badge variant="success">Live</Badge>
                ) : (
                  <Badge variant="outline">Coming soon</Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{c.tagline}</p>
              {c.status === 'live' && c.courseList.length > 0 && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {c.courseList.length} modules ·{' '}
                  {c.courseList.reduce((sum, m) => sum + m.lessonCount, 0)} lessons
                </p>
              )}
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
