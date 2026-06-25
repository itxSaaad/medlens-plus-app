import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { ProseContent } from "@/components/marketing/prose-content";
import { RelatedLinks } from "@/components/marketing/related-links";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { JsonLdGroup } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schema";
import { getPageContent } from "@/lib/content/loader";
import { getSiteUrl } from "@/lib/utils";

const SLUG = "about";

export function generateMetadata(): Metadata {
  const page = getPageContent(SLUG);
  return buildPageMetadata(page.seo, `/${SLUG}`);
}

export default function AboutPage() {
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
      <PageHero eyebrow="About" title={page.title} description={page.description} />
      <section className="section-padding">
        <div className="container-marketing max-w-3xl">
          {page.sections && <ProseContent sections={page.sections} />}
          {page.links && <RelatedLinks links={page.links} />}
        </div>
      </section>
      <CtaBanner
        title="Want early access?"
        description="We're opening the beta in batches. Join the waitlist to get notified."
        ctaLabel="Join the waitlist"
      />
    </>
  );
}
