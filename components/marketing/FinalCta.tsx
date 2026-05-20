import { Container } from '@/components/layout/Container';
import { WaitlistForm } from './WaitlistForm';

export function FinalCta() {
  return (
    <section className="border-t border-border bg-card/40 py-20 mt-24">
      <Container className="text-center max-w-2xl">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          The Academy is opening with operators, not algorithms.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground">
          Get on the waitlist now. Founders pricing closes at 100 individual operators.
        </p>
        <div className="mt-8 max-w-xl mx-auto">
          <WaitlistForm source="final-cta" foundersTier buttonLabel="Get my founders seat" />
        </div>
      </Container>
    </section>
  );
}
