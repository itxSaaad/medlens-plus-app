import Link from "next/link";
import type { UseCaseCard } from "@medlens/types";
import { ArrowRight } from "lucide-react";

interface UseCaseCardsProps {
  title: string;
  items: UseCaseCard[];
}

export function UseCaseCards({ title, items }: UseCaseCardsProps) {
  return (
    <section aria-labelledby="use-cases-heading" className="section-padding bg-surface">
      <div className="container-marketing">
        <h2 id="use-cases-heading">{title}</h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <li key={item.slug}>
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-xl border border-border bg-paper p-6 transition-shadow hover:shadow-md"
              >
                <h3 className="font-display text-xl group-hover:text-lens">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm">{item.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-lens">
                  Learn more <ArrowRight className="size-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
