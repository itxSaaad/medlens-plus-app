import type { HomeContent } from "@medlens/types";
import { TimelineVisual } from "./timeline-visual";

interface ProductPreviewProps {
  content: HomeContent["productPreview"];
}

export function ProductPreview({ content }: ProductPreviewProps) {
  return (
    <section aria-labelledby="preview-heading" className="section-padding bg-surface">
      <div className="container-marketing grid items-center gap-12 lg:grid-cols-2">
        <TimelineVisual />
        <div>
          <h2 id="preview-heading">{content.title}</h2>
          <p className="prose-narrow mt-4 text-base">{content.description}</p>
        </div>
      </div>
    </section>
  );
}
