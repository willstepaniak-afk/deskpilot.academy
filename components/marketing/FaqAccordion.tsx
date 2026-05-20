import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Faq } from '@/lib/faqs';

// Both variants render all items open by default at SSR. The static HTML
// crawlers see contains every question AND every answer — critical for AEO
// and LLM crawlers that don't execute JS. Users can still collapse on
// interaction (Radix preserves the toggle behavior).
export function FaqAccordion({
  faqs,
  type = 'multiple',
}: {
  faqs: Faq[];
  type?: 'single' | 'multiple';
}) {
  const allValues = faqs.map((_, i) => `item-${i}`);

  if (type === 'single') {
    return (
      <Accordion type="single" collapsible defaultValue={allValues[0]}>
        {faqs.map((f, i) => (
          <FaqRow key={f.question} faq={f} index={i} />
        ))}
      </Accordion>
    );
  }
  return (
    <Accordion type="multiple" defaultValue={allValues}>
      {faqs.map((f, i) => (
        <FaqRow key={f.question} faq={f} index={i} />
      ))}
    </Accordion>
  );
}

function FaqRow({ faq, index }: { faq: Faq; index: number }) {
  return (
    <AccordionItem value={`item-${index}`}>
      <AccordionTrigger>{faq.question}</AccordionTrigger>
      <AccordionContent>{faq.answer}</AccordionContent>
    </AccordionItem>
  );
}
