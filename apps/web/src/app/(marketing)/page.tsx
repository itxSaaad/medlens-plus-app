import type { Metadata } from "next";
import { ComparisonTable } from "@/components/marketing/comparison-table";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { FaqSection } from "@/components/marketing/faq-section";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { HeroSection } from "@/components/marketing/hero-section";
import { ProblemStatement } from "@/components/marketing/problem-statement";
import { ProductPreview } from "@/components/marketing/product-preview";
import { SocialProofBar } from "@/components/marketing/social-proof-bar";
import { StepsSection } from "@/components/marketing/steps-section";
import { TrustSafetyBlock } from "@/components/marketing/trust-safety-block";
import { UseCaseCards } from "@/components/marketing/use-case-cards";
import { JsonLdGroup } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  faqPageSchema,
  organizationSchema,
  softwareApplicationSchema,
  webSiteSchema,
} from "@/lib/seo/schema";
import { getHomeContent, getSiteConfig } from "@/lib/content/loader";
import { getGithubUrl, getSiteUrl } from "@/lib/utils";

export function generateMetadata(): Metadata {
  const home = getHomeContent();
  return buildPageMetadata(home.seo, "/");
}

export default function HomePage() {
  const home = getHomeContent();
  const site = getSiteConfig();
  const siteUrl = getSiteUrl();
  const githubUrl = getGithubUrl();
  const sameAs = githubUrl ? [githubUrl] : [];

  return (
    <>
      <JsonLdGroup
        items={[
          organizationSchema(siteUrl, site.contactEmail, sameAs),
          webSiteSchema(siteUrl),
          softwareApplicationSchema(siteUrl),
          faqPageSchema(home.faq.items),
        ]}
      />
      <HeroSection content={home.hero} />
      <SocialProofBar items={home.socialProof} />
      <ProblemStatement content={home.problem} />
      <ProductPreview content={home.productPreview} />
      <StepsSection content={home.steps} />
      <FeatureGrid content={home.features} />
      <ComparisonTable title={home.comparison.title} rows={home.comparison.rows} />
      <UseCaseCards title={home.useCases.title} items={home.useCases.items} />
      <TrustSafetyBlock
        title={home.trust.title}
        description={home.trust.description}
        items={home.trust.items}
      />
      <FaqSection title={home.faq.title} items={home.faq.items} />
      <CtaBanner
        title={home.finalCta.title}
        description={home.finalCta.description}
        ctaLabel={home.finalCta.ctaLabel}
      />
    </>
  );
}
