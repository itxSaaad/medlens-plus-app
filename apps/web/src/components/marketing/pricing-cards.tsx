import type { PricingTier } from "@medlens/types";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ICON_STROKE } from "./icon-maps";

interface PricingCardsProps {
  tiers: PricingTier[];
}

export function PricingCards({ tiers }: PricingCardsProps) {
  return (
    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className={cn(
            "relative rounded-2xl border p-8",
            tier.highlighted
              ? "border-lens bg-paper shadow-lg ring-1 ring-lens/20"
              : "border-border bg-surface",
          )}
        >
          {tier.highlighted && (
            <Badge className="absolute -top-3 left-6" variant="default">
              Current offer
            </Badge>
          )}
          <h3 className="font-display text-2xl text-ink">{tier.name}</h3>
          <p className="mt-2 font-display text-4xl text-ink">{tier.price}</p>
          <p className="mt-3 text-sm text-muted">{tier.description}</p>
          <ul className="mt-6 space-y-3">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-ink">
                <Check className="mt-0.5 size-4 shrink-0 text-lens" strokeWidth={ICON_STROKE} />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
