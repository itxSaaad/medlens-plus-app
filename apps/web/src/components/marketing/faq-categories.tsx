import type { FaqItem } from "@medlens/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqCategoriesProps {
  items: FaqItem[];
}

const CATEGORY_LABELS: Record<string, string> = {
  product: "Product",
  privacy: "Privacy & data",
  safety: "Safety",
  general: "General",
};

export function FaqCategories({ items }: FaqCategoriesProps) {
  const grouped = items.reduce<Record<string, FaqItem[]>>((acc, item) => {
    const key = item.category ?? "general";
    acc[key] = acc[key] ?? [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-12">
      {Object.entries(grouped).map(([category, faqs]) => (
        <section key={category} aria-labelledby={`faq-${category}`}>
          <h2 id={`faq-${category}`} className="font-display text-2xl text-ink">
            {CATEGORY_LABELS[category] ?? category}
          </h2>
          <Accordion type="single" collapsible className="mt-6">
            {faqs.map((item, index) => (
              <AccordionItem key={item.question} value={`${category}-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      ))}
    </div>
  );
}
