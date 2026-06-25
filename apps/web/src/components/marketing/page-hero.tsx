import type { ReactNode } from "react";
import { MeshGradient } from "./backgrounds/mesh-gradient";
import { DotGrid } from "./backgrounds/dot-grid";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
  variant?: "default" | "minimal";
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  variant = "default",
}: PageHeroProps) {
  return (
    <section
      aria-labelledby="page-hero-heading"
      className={cn(
        "relative overflow-hidden border-b border-border",
        variant === "default" ? "section-padding bg-surface" : "py-12",
      )}
    >
      {variant === "default" && (
        <>
          <MeshGradient />
          <DotGrid />
        </>
      )}
      <div className="container-marketing relative">
        {eyebrow && (
          <p className="mb-3 font-sans text-sm font-semibold uppercase tracking-widest text-lens">
            {eyebrow}
          </p>
        )}
        <h1 id="page-hero-heading" className="max-w-3xl">
          {title}
        </h1>
        <p className="prose-narrow mt-4 max-w-2xl text-lg">{description}</p>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
