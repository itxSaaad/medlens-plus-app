import type { ReactNode } from "react";
import { MeshGradient } from "./mesh-gradient";
import { DotGrid } from "./dot-grid";
import { cn } from "@/lib/utils";

interface SectionGlowProps {
  children: ReactNode;
  className?: string;
  variant?: "mesh" | "grid" | "both";
}

export function SectionGlow({ children, className, variant = "both" }: SectionGlowProps) {
  return (
    <section className={cn("relative overflow-hidden", className)}>
      {variant !== "grid" && <MeshGradient />}
      {variant !== "mesh" && <DotGrid />}
      <div className="relative">{children}</div>
    </section>
  );
}
