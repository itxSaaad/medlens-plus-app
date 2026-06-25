import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionGlow } from "@/components/marketing/backgrounds/section-glow";
import { ProcessTimeline } from "@/components/marketing/process-timeline";
import { ProseContent } from "@/components/marketing/prose-content";
import { RelatedLinks } from "@/components/marketing/related-links";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { JsonLdGroup } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schema";
import { getPageContent } from "@/lib/content/loader";
import { getSiteUrl } from "@/lib/utils";

const SLUG = "how-it-works";

export function generateMetadata(): Metadata {
  const page = getPageContent(SLUG);
  return buildPageMetadata(page.seo, `/${SLUG}`);
}

export default function HowItWorksPage() {
  const page = getPageContent(SLUG);
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/${SLUG}`;

  const steps = page.sections
    ?.filter((s) => s.heading?.startsWith("Step"))
    .map((s) => ({
      title: s.heading?.replace(/^Step \d+:\s*/, "") ?? "",
      description: s.paragraphs[0] ?? "",
      icon: ["upload", "timeline", "brief"][page.sections!.indexOf(s) % 3],
    }));

  const proseSections = page.sections?.filter((s) => !s.heading?.startsWith("Step"));

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
      <PageHero eyebrow="How it works" title={page.title} description={page.description} />
      {steps && steps.length > 0 && (
        <SectionGlow variant="grid" className="bg-surface">
          <ProcessTimeline items={steps} />
        </SectionGlow>
      )}
      {proseSections && proseSections.length > 0 && (
        <section className="section-padding bg-surface">
          <div className="container-marketing max-w-3xl">
            <ProseContent sections={proseSections} />
            {page.links && <RelatedLinks links={page.links} />}
          </div>
        </section>
      )}
      <CtaBanner
        title="Ready to organize your reports?"
        description="Upload PDFs, see trends, and walk into your next visit prepared."
        ctaLabel="Join the waitlist"
      />
    </>
  );
}
