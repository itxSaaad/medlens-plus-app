import Link from "next/link";
import type { ContentLink } from "@medlens/types";
import { ArrowRight } from "lucide-react";
import { ICON_STROKE } from "./icon-maps";

interface RelatedLinksProps {
  title?: string;
  links: ContentLink[];
}

export function RelatedLinks({ title = "Keep reading", links }: RelatedLinksProps) {
  if (links.length === 0) return null;

  return (
    <nav aria-label={title} className="mt-12 rounded-xl border border-border bg-surface p-6">
      <h2 className="font-sans text-sm font-semibold uppercase tracking-wide text-muted">
        {title}
      </h2>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-lens"
            >
              {link.label}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                strokeWidth={ICON_STROKE}
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
