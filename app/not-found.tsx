import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <Container className="py-24 max-w-2xl text-center">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Not found</h1>
      <p className="mt-4 text-base text-muted-foreground">
        The page you were looking for is not here. It might have moved or never existed.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild variant="accent">
          <Link href="/">Back home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/campuses">Browse campuses</Link>
        </Button>
      </div>
    </Container>
  );
}
