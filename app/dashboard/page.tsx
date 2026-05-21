import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getProfile } from '@/lib/auth';
import { getLiveCampuses } from '@/lib/campuses';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const [profile, liveCampuses] = await Promise.all([getProfile(), getLiveCampuses()]);
  const firstName = profile?.full_name?.split(' ')[0];

  return (
    <Container className="py-12 space-y-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome{firstName ? `, ${firstName}` : ''}.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your DeskPilot Academy home. Campuses you enroll in will appear here.
        </p>
      </header>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Your access
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(profile?.products ?? []).length > 0 ? (
            profile!.products.map((p) => (
              <Badge key={p} variant="success">
                {p}
              </Badge>
            ))
          ) : (
            <Badge variant="outline">none yet</Badge>
          )}
          {profile?.founders_member && <Badge variant="accent">Founder</Badge>}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Enrolled campuses
        </h2>
        <Card className="mt-3 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            You&apos;re not enrolled in any campuses yet. Course delivery opens in a future release —
            you&apos;ll see your campuses here when it does.
          </p>
          <div className="mt-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/campuses">See available campuses</Link>
            </Button>
          </div>
          {liveCampuses.length > 0 && (
            <p className="mt-4 text-xs text-muted-foreground">
              {liveCampuses.length} campuses are live: {liveCampuses.map((c) => c.name).join(', ')}.
            </p>
          )}
        </Card>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Account
        </h2>
        <Card className="mt-3 p-5">
          <dl className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd>{profile?.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Name</dt>
              <dd>{profile?.full_name || '—'}</dd>
            </div>
          </dl>
        </Card>
      </section>
    </Container>
  );
}
