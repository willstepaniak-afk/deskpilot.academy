import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Faq } from '@/lib/faqs';

export function FaqAccordion({ faqs, type = 'multiple' }: { faqs: Faq[]; type?: 'single' | 'multiple' }) {
  if (type === 'single') {
    return (
      <Accordion type="single" collapsible>
        {faqs.map((f, i) => (
          <AccordionItem key={f.question} value={`item-${i}`}>
            <AccordionTrigger>{f.question}</AccordionTrigger>
            <AccordionContent>{f.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }
  return (
    <Accordion type="multiple">
      {faqs.map((f, i) => (
        <AccordionItem key={f.question} value={`item-${i}`}>
          <AccordionTrigger>{f.question}</AccordionTrigger>
          <AccordionContent>{f.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
