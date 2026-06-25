import type { Metadata } from "next";
import Link from "next/link";
import { getSiteConfig } from "@/lib/content/loader";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const site = getSiteConfig();

  return (
    <>
      <SiteHeader site={site} />
      <main id="main-content" className="flex-1 section-padding">
        <div className="container-marketing max-w-lg text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-wide text-lens">404</p>
          <h1 className="mt-4">Page not found</h1>
          <p className="mt-4 text-muted">
            That page doesn&apos;t exist or may have moved. Try the homepage or browse features.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/">Back to home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/features">View features</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter site={site} />
    </>
  );
}
