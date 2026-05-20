import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Thanks',
  robots: { index: false, follow: false },
};

const RESOURCE_TITLES: Record<string, string> = {
  'fi-menu-cheatsheet': 'F&I Menu Cheatsheet',
  'objection-tree-pack': 'Objection Tree Pack',
  'desking-payment-grid': 'Desking Payment Grid',
  'compliance-quickref': 'Compliance Quick Reference',
  'manager-1-1-template': 'Manager 1:1 Template',
};

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string; resource?: string; type?: string }>;
}) {
  const params = await searchParams;
  const source = params.source ?? 'general';
  const resource = params.resource;
  const type = params.type;

  const isNotify = type === 'notify';
  const resourceTitle = resource && RESOURCE_TITLES[resource] ? RESOURCE_TITLES[resource] : null;

  const message = (() => {
    if (isNotify && resourceTitle) {
      return (
        <>
          Thanks — we will email you the moment the <strong>{resourceTitle}</strong> is ready. While you wait,{' '}
          <Link href="/campuses" className="underline">
            browse the campuses
          </Link>
          .
        </>
      );
    }
    if (isNotify) {
      return (
        <>
          Thanks — we will email you the moment that resource is ready. While you wait,{' '}
          <Link href="/campuses" className="underline">
            browse the campuses
          </Link>
          .
        </>
      );
    }
    switch (source) {
      case 'waitlist':
      case 'hero':
      case 'final-cta':
        return 'You are on the waitlist. We will email you the moment the Academy opens.';
      case 'inquiry':
        return 'Got your dealer inquiry. Will reads every one personally during the founders phase — expect a reply within one business day.';
      case 'resource':
        return 'Got it — we will be in touch.';
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
