"use client";

import type { HomeContent } from "@medlens/types";
import { MeshGradient } from "./backgrounds/mesh-gradient";
import { DotGrid } from "./backgrounds/dot-grid";
import { WaitlistForm } from "./waitlist-form";
import { TimelineVisual } from "./timeline-visual";
import { FadeUp } from "./motion-primitives";

interface HeroSectionProps {
  content: HomeContent["hero"];
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden section-padding bg-surface"
    >
      <MeshGradient />
      <DotGrid />
      <div className="container-marketing relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <FadeUp>
            <p className="mb-4 font-sans text-sm font-semibold uppercase tracking-widest text-lens">
              {content.eyebrow ?? "Lab report intelligence"}
            </p>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h1 id="hero-heading" className="max-w-xl">
              {content.headline}
            </h1>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="prose-narrow mt-6 text-lg text-muted">{content.subheadline}</p>
          </FadeUp>
          <FadeUp delay={0.24}>
            <div className="mt-8">
              <WaitlistForm
                ctaLabel={content.ctaLabel}
                privacyNote={content.privacyNote}
                id="hero-waitlist"
              />
            </div>
          </FadeUp>
        </div>
        <FadeUp delay={0.2}>
          <TimelineVisual />
        </FadeUp>
      </div>
    </section>
  );
}
