import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Wordmark } from '@/components/layout/Wordmark';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getCurrentUser, getProfile, hasAcademyAccess } from '@/lib/auth';
import { signOut } from '@/app/auth/actions';
import { SITE } from '@/lib/site';

// Always render per-request — the dashboard reads the session cookie and must
// never be statically prerendered (which would bake in a build-time redirect).
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/dashboard');

  const profile = await getProfile();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card/40">
        <Container className="flex h-16 items-center justify-between">
          <Wordmark />
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-muted-foreground">
              {profile?.full_name || profile?.email || user.email}
            </span>
            <form action={signOut}>
              <Button type="submit" variant="ghost" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </Container>
      </header>

      <main className="flex-1">
        {hasAcademyAccess(profile) ? (
          children
        ) : (
          <Container className="py-20 max-w-xl">
            <Card className="p-8 text-center">
              <h1 className="text-2xl font-bold tracking-tight">Your account is ready</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                You&apos;re signed in, but you don&apos;t have Academy access yet. Subscribe to unlock
                every campus — founders pricing is live while seats last.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Button asChild variant="accent">
                  <Link href="/subscribe">Subscribe</Link>
                </Button>
                <Button asChild variant="ghost">
                  <a href={`mailto:${SITE.contactEmail}`}>Contact us</a>
                </Button>
              </div>
            </Card>
          </Container>
        )}
      </main>
    </div>
  );
}
