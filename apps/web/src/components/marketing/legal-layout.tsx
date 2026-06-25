import type { ProseSection } from "@medlens/types";

interface LegalLayoutProps {
  title: string;
  description: string;
  updatedAt: string;
  sections: ProseSection[];
}

export function LegalLayout({ title, description, updatedAt, sections }: LegalLayoutProps) {
  const toc = sections.filter((s) => s.heading).map((s) => s.heading!);

  return (
    <div className="section-padding">
      <div className="container-marketing grid gap-12 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <nav aria-label="Table of contents" className="sticky top-24">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">On this page</p>
            <ul className="mt-4 space-y-2 border-l border-border pl-4">
              {toc.map((heading) => (
                <li key={heading}>
                  <a href={`#${slugify(heading)}`} className="text-sm text-muted hover:text-lens">
                    {heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <article className="max-w-3xl">
          <header>
            <h1>{title}</h1>
            <p className="mt-4 text-lg text-muted">{description}</p>
            <p className="mt-2 text-sm text-muted">
              Last updated{" "}
              <time dateTime={updatedAt}>
                {new Date(updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </p>
          </header>
          <div className="prose-narrow mt-10 space-y-10">
            {sections.map((section, index) => (
              <section
                key={section.heading ?? index}
                id={section.heading ? slugify(section.heading) : undefined}
              >
                {section.heading && (
                  <h2 className="font-display text-2xl text-ink">{section.heading}</h2>
                )}
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((p, i) => (
                    <p key={i} className="text-base leading-relaxed text-muted">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
