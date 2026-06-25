import type { BentoItem } from "@medlens/types";
import { FEATURE_ICONS, ICON_STROKE } from "./icon-maps";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeInView } from "./motion-primitives";

interface BentoFeatureGridProps {
  items: BentoItem[];
}

export function BentoFeatureGrid({ items }: BentoFeatureGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const Icon = FEATURE_ICONS[item.icon ?? "shield"] ?? Shield;
        return (
          <FadeInView
            key={item.title}
            className={cn(
              "rounded-xl border border-border bg-paper p-6 shadow-sm transition-shadow hover:shadow-md",
              item.span === "wide" && "sm:col-span-2",
              item.span === "tall" && "lg:row-span-2",
            )}
          >
            <Icon className="size-6 text-lens" strokeWidth={ICON_STROKE} aria-hidden="true" />
            <h3 className="mt-4 font-display text-xl text-ink">{item.title}</h3>
            <p className="mt-2 text-sm text-muted">{item.description}</p>
          </FadeInView>
        );
      })}
    </div>
  );
}
