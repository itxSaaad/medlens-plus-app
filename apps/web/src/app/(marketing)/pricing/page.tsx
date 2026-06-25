import type { Metadata } from "next";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { FaqSection } from "@/components/marketing/faq-section";
import { PageHero } from "@/components/marketing/page-hero";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { MeshGradient } from "@/components/marketing/backgrounds/mesh-gradient";
import { JsonLdGroup } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqPageSchema, webPageSchema } from "@/lib/seo/schema";
import { getPageContent } from "@/lib/content/loader";
import { getSiteUrl } from "@/lib/utils";

const SLUG = "pricing";

export function generateMetadata(): Metadata {
  const page = getPageContent(SLUG);
  return buildPageMetadata(page.seo, `/${SLUG}`);
}

export default function PricingPage() {
  const page = getPageContent(SLUG);
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/${SLUG}`;

  return (
    <>
      <JsonLdGroup
        items={[
          webPageSchema({
            title: page.title,
            description: page.description,
            url,
            updatedAt: page.updatedAt,
          }),
          breadcrumbSchema([
            { name: "Home", url: siteUrl },
            { name: page.title, url },
          ]),
          ...(page.faq ? [faqPageSchema(page.faq)] : []),
        ]}
      />
      <PageHero eyebrow="Pricing" title={page.title} description={page.description} />
      {page.pricing && (
        <section className="relative section-padding">
          <MeshGradient className="opacity-60" />
          <div className="container-marketing relative">
            <PricingCards tiers={page.pricing.tiers} />
          </div>
        </section>
      )}
      {page.faq && page.faq.length > 0 && (
        <FaqSection title="Pricing questions" items={page.faq} id="pricing-faq" />
      )}
      <CtaBanner
        title="Reserve your spot"
        description="Early access is free. We'll email you when your invite is ready."
        ctaLabel="Join the waitlist"
      />
    </>
  );
}
