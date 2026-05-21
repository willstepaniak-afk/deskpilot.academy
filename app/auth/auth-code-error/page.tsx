import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Sign-in error',
  robots: { index: false, follow: false },
};

export default function AuthCodeErrorPage() {
  return (
    <Container className="py-24 max-w-md text-center">
      <h1 className="text-2xl font-bold tracking-tight">That link didn&apos;t work</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        The sign-in link was invalid or expired. Request a fresh one and try again.
      </p>
      <div className="mt-6">
        <Button asChild variant="accent">
          <Link href="/login">Back to sign in</Link>
        </Button>
      </div>
    </Container>
  );
}
