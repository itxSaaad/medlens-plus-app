"use client";

import { Shield } from "lucide-react";
import type { HomeContent } from "@medlens/types";
import { FadeInView } from "./motion-primitives";
import { FEATURE_ICONS, ICON_STROKE } from "./icon-maps";

interface FeatureGridProps {
  content: HomeContent["features"];
}

export function FeatureGrid({ content }: FeatureGridProps) {
  return (
    <section aria-labelledby="features-heading" className="section-padding bg-surface">
      <div className="container-marketing">
        <h2 id="features-heading" className="text-center">
          {content.title}
        </h2>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((feature) => {
            const Icon = FEATURE_ICONS[feature.icon ?? "shield"] ?? Shield;
            return (
              <li key={feature.title}>
                <FadeInView className="h-full rounded-xl border border-border bg-paper p-6">
                  <Icon className="size-6 text-lens" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  <h3 className="mt-4 font-display text-xl">{feature.title}</h3>
                  <p className="mt-2 text-sm">{feature.description}</p>
                </FadeInView>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
