import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Thanks',
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const params = await searchParams;
  const source = params.source ?? 'general';

  const message = (() => {
    switch (source) {
      case 'waitlist':
      case 'hero':
      case 'final-cta':
        return 'You are on the waitlist. We will email you the moment the Academy opens.';
      case 'inquiry':
        return 'Got your dealer inquiry. Will reads every one personally during the founders phase — expect a reply within one business day.';
      case 'resource':
        return 'Check your inbox — the resource is on its way.';
      default:
        return 'Got it. We will be in touch.';
    }
  })();

  return (
    <Container className="py-24 max-w-2xl text-center">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Thanks.</h1>
      <p className="mt-4 text-base text-muted-foreground">{message}</p>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild variant="accent">
          <Link href="/campuses">See the campuses</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </Container>
  );
}
