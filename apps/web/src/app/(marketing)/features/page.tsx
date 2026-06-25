import type { Metadata } from "next";
import { BentoFeatureGrid } from "@/components/marketing/bento-feature-grid";
import { SectionGlow } from "@/components/marketing/backgrounds/section-glow";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { PageHero } from "@/components/marketing/page-hero";
import { ProseContent } from "@/components/marketing/prose-content";
import { RelatedLinks } from "@/components/marketing/related-links";
import { JsonLdGroup } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schema";
import { getPageContent } from "@/lib/content/loader";
import { getSiteUrl } from "@/lib/utils";

const SLUG = "features";

export function generateMetadata(): Metadata {
  const page = getPageContent(SLUG);
  return buildPageMetadata(page.seo, `/${SLUG}`);
}

export default function FeaturesPage() {
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
        ]}
      />
      <PageHero eyebrow="Product" title={page.title} description={page.description} />
      {page.bento && (
        <SectionGlow variant="mesh" className="section-padding bg-paper">
          <div className="container-marketing">
            <BentoFeatureGrid items={page.bento} />
          </div>
        </SectionGlow>
      )}
      {page.sections && (
        <section className="section-padding bg-surface">
          <div className="container-marketing max-w-3xl">
            <ProseContent sections={page.sections} />
            {page.links && <RelatedLinks links={page.links} />}
          </div>
        </section>
      )}
      <CtaBanner
        title="See your reports on a timeline"
        description="Join the waitlist and we'll let you know when early access opens."
        ctaLabel="Join the waitlist"
      />
    </>
  );
}
