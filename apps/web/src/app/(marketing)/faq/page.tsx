import type { Metadata } from "next";
import { FaqCategories } from "@/components/marketing/faq-categories";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { JsonLdGroup } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqPageSchema, webPageSchema } from "@/lib/seo/schema";
import { getPageContent } from "@/lib/content/loader";
import { getSiteUrl } from "@/lib/utils";

const SLUG = "faq";

export function generateMetadata(): Metadata {
  const page = getPageContent(SLUG);
  return buildPageMetadata(page.seo, `/${SLUG}`);
}

export default function FaqPage() {
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
      <PageHero eyebrow="FAQ" title={page.title} description={page.description} />
      <section className="section-padding">
        <div className="container-marketing max-w-3xl">
          {page.faq && <FaqCategories items={page.faq} />}
        </div>
      </section>
      <CtaBanner
        title="Still have questions?"
        description="Join the waitlist and we'll share updates as we open the beta."
        ctaLabel="Join the waitlist"
      />
    </>
  );
}
