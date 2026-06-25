import type { FaqItem } from "@medlens/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqSectionProps {
  title: string;
  items: FaqItem[];
  id?: string;
}

export function FaqSection({ title, items, id = "faq" }: FaqSectionProps) {
  return (
    <section aria-labelledby={`${id}-heading`} className="section-padding bg-surface">
      <div className="container-marketing max-w-3xl">
        <h2 id={`${id}-heading`} className="text-center">
          {title}
        </h2>
        <Accordion type="single" collapsible className="mt-10">
          {items.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
