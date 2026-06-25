"use client";

import type { HomeContent } from "@medlens/types";
import { Upload } from "lucide-react";
import { FadeInView } from "./motion-primitives";
import { STEP_ICONS, ICON_STROKE } from "./icon-maps";

interface StepsSectionProps {
  content: HomeContent["steps"];
}

export function StepsSection({ content }: StepsSectionProps) {
  return (
    <section aria-labelledby="steps-heading" className="section-padding">
      <div className="container-marketing">
        <h2 id="steps-heading" className="text-center">
          {content.title}
        </h2>
        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {content.items.map((step, index) => {
            const Icon = STEP_ICONS[step.icon ?? "upload"] ?? Upload;
            return (
              <li key={step.title}>
                <FadeInView className="relative h-full rounded-xl border border-border bg-paper p-6">
                  <span className="mb-4 flex size-10 items-center justify-center rounded-lg bg-accent text-lens">
                    <Icon className="size-5" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  </span>
                  <p className="font-sans text-xs font-semibold uppercase tracking-wide text-lens">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-2 font-display text-xl">{step.title}</h3>
                  <p className="mt-3 text-sm">{step.description}</p>
                </FadeInView>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
