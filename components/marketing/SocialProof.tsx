import { Container } from '@/components/layout/Container';

// Placeholder logos — replace once Will confirms dealer-group permission.
// Do NOT invent dealer names.
const SLOTS = ['Dealer Group A', 'Dealer Group B', 'Dealer Group C', 'Dealer Group D', 'Dealer Group E'];

export function SocialProof() {
  return (
    <section className="border-y border-border/60 bg-card/40 py-10">
      <Container>
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">
          Built with operators from
        </p>
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {SLOTS.map((slot) => (
            <li
              key={slot}
              className="flex h-12 items-center justify-center rounded-md border border-dashed border-border bg-background text-xs text-muted-foreground"
              aria-label={`Dealer group logo placeholder: ${slot}`}
            >
              {slot}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
