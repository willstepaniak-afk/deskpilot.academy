// Wave 1 placeholder — Wave 3 replaces this with the full homepage.
import { LOCKED_H1, LOCKED_SUBHEAD } from '@/lib/copy';
import { Container } from '@/components/layout/Container';

export default function HomePage() {
  return (
    <Container className="py-24">
      <h1 className="text-4xl font-bold tracking-tight">{LOCKED_H1}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{LOCKED_SUBHEAD}</p>
    </Container>
  );
}
