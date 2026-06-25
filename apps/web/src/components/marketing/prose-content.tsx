import type { ProseSection } from "@medlens/types";

interface ProseContentProps {
  sections: ProseSection[];
}

export function ProseContent({ sections }: ProseContentProps) {
  return (
    <div className="prose-narrow space-y-8">
      {sections.map((section, index) => (
        <section key={section.heading ?? index}>
          {section.heading && <h2 className="font-display text-2xl text-ink">{section.heading}</h2>}
          <div className="mt-4 space-y-4">
            {section.paragraphs.map((paragraph, pIndex) => (
              <p key={pIndex} className="text-base leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
