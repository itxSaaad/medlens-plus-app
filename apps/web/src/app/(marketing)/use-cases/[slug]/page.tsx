import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { PageHero } from "@/components/marketing/page-hero";
import { ProseContent } from "@/components/marketing/prose-content";
import { FaqSection } from "@/components/marketing/faq-section";
import { RelatedLinks } from "@/components/marketing/related-links";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { JsonLdGroup } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqPageSchema, webPageSchema } from "@/lib/seo/schema";
import { getAllUseCaseSlugs, getUseCase } from "@/lib/content/loader";
import { getSiteUrl } from "@/lib/utils";

interface UseCasePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllUseCaseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: UseCasePageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const useCase = getUseCase(slug);
    return buildPageMetadata(useCase.seo, `/use-cases/${slug}`);
  } catch {
    return {};
  }
}

export default async function UseCasePage({ params }: UseCasePageProps) {
  const { slug } = await params;

  let useCase;
  try {
    useCase = getUseCase(slug);
  } catch {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/use-cases/${slug}`;

  return (
    <>
      <JsonLdGroup
        items={[
          webPageSchema({
            title: useCase.title,
            description: useCase.description,
            url,
            updatedAt: useCase.updatedAt,
          }),
          breadcrumbSchema([
            { name: "Home", url: siteUrl },
            { name: "Use cases", url: `${siteUrl}/use-cases` },
            { name: useCase.title, url },
          ]),
          ...(useCase.faq ? [faqPageSchema(useCase.faq)] : []),
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Use cases", href: "/use-cases" },
          { label: useCase.title },
        ]}
      />
      <PageHero
        eyebrow={useCase.persona ?? "Use case"}
        title={useCase.title}
        description={useCase.description}
        variant="minimal"
      />
      <article className="section-padding">
        <div className="container-marketing max-w-3xl">
          <ProseContent sections={useCase.sections} />
          {useCase.links && useCase.links.length > 0 && <RelatedLinks links={useCase.links} />}
        </div>
      </article>
      {useCase.faq && useCase.faq.length > 0 && (
        <FaqSection title="Common questions" items={useCase.faq} id={`use-case-${slug}-faq`} />
      )}
      <CtaBanner
        title="Try it on your lab history"
        description="Join the waitlist and we'll notify you when early access opens."
        ctaLabel="Join the waitlist"
      />
    </>
  );
}
