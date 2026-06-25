import type { HomeContent } from "@medlens/types";

interface ProblemStatementProps {
  content: HomeContent["problem"];
}

export function ProblemStatement({ content }: ProblemStatementProps) {
  return (
    <section aria-labelledby="problem-heading" className="section-padding">
      <div className="container-marketing">
        <h2 id="problem-heading" className="max-w-2xl">
          {content.title}
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {content.items.map((item) => (
            <li key={item.title} className="rounded-xl border border-border bg-paper p-6">
              <h3 className="font-display text-xl text-ink">{item.title}</h3>
              <p className="mt-3 text-sm">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
