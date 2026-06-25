import type { StepItem } from "@medlens/types";
import { FEATURE_ICONS, ICON_STROKE } from "./icon-maps";
import { Upload } from "lucide-react";
import { FadeInView } from "./motion-primitives";

interface ProcessTimelineProps {
  title?: string;
  items: StepItem[];
}

export function ProcessTimeline({ title, items }: ProcessTimelineProps) {
  return (
    <section aria-labelledby={title ? "process-heading" : undefined} className="section-padding">
      <div className="container-marketing">
        {title && (
          <h2 id="process-heading" className="text-center">
            {title}
          </h2>
        )}
        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {items.map((step, index) => {
            const Icon = FEATURE_ICONS[step.icon ?? "upload"] ?? Upload;
            return (
              <FadeInView key={step.title}>
                <li className="relative rounded-xl border border-border bg-paper p-6">
                  {index < items.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute -right-4 top-1/2 hidden h-px w-8 bg-border md:block"
                    />
                  )}
                  <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-lens">
                    <Icon className="size-5" strokeWidth={ICON_STROKE} />
                  </span>
                  <p className="mt-4 font-sans text-xs font-semibold uppercase tracking-wide text-lens">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-2 font-display text-xl">{step.title}</h3>
                  <p className="mt-3 text-sm text-muted">{step.description}</p>
                </li>
              </FadeInView>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
