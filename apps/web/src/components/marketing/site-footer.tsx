import Link from "next/link";
import type { SiteConfig } from "@medlens/types";
import { Separator } from "@/components/ui/separator";
import { LogoWordmark } from "./logo-wordmark";

interface SiteFooterProps {
  site: SiteConfig;
}

export function SiteFooter({ site }: SiteFooterProps) {
  return (
    <footer className="border-t border-border bg-paper">
      <div className="container-marketing section-padding !py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <LogoWordmark className="inline-flex items-center gap-2 text-ink" />
            <p className="mt-4 max-w-sm text-sm text-muted">
              {site.tagline}. Not a substitute for professional medical advice.
            </p>
            <address className="mt-4 not-italic text-sm text-muted">
              Contact:{" "}
              <a href={`mailto:${site.contactEmail}`} className="text-lens hover:underline">
                {site.contactEmail}
              </a>
            </address>
          </div>

          <nav aria-label="Product">
            <h2 className="font-sans text-sm font-semibold uppercase tracking-wide text-ink">
              Product
            </h2>
            <ul className="mt-4 space-y-3">
              {site.footer.product.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-lens">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources">
            <h2 className="font-sans text-sm font-semibold uppercase tracking-wide text-ink">
              Resources
            </h2>
            <ul className="mt-4 space-y-3">
              {site.footer.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-lens">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h2 className="font-sans text-sm font-semibold uppercase tracking-wide text-ink">
              Legal
            </h2>
            <ul className="mt-4 space-y-3">
              {site.footer.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-lens">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <ul className="flex gap-4">
            {site.social.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="hover:text-lens"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
