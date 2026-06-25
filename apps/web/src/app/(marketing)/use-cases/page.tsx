import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { ContentCard } from "@/components/marketing/content-card";
import { DotGrid } from "@/components/marketing/backgrounds/dot-grid";
import { JsonLdGroup } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, itemListSchema } from "@/lib/seo/schema";
import { getAllUseCases, getUseCasesIndex } from "@/lib/content/loader";
import { getSiteUrl } from "@/lib/utils";

export function generateMetadata(): Metadata {
  const index = getUseCasesIndex();
  return buildPageMetadata(index.seo, "/use-cases");
}

export default function UseCasesIndexPage() {
  const index = getUseCasesIndex();
  const cases = getAllUseCases();
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLdGroup
        items={[
          collectionPageSchema({
            title: index.title,
            description: index.description,
            url: `${siteUrl}/use-cases`,
          }),
          breadcrumbSchema([
            { name: "Home", url: siteUrl },
            { name: "Use cases", url: `${siteUrl}/use-cases` },
          ]),
          itemListSchema(
            cases.map((c) => ({ name: c.title, url: `${siteUrl}/use-cases/${c.slug}` })),
          ),
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Use cases" }]} />
      <section className="relative overflow-hidden border-b border-border bg-surface py-16">
        <DotGrid />
        <div className="container-marketing relative">
          <h1>{index.title}</h1>
          <p className="prose-narrow mt-4 max-w-2xl text-lg">{index.description}</p>
        </div>
      </section>
      <div className="section-padding">
        <div className="container-marketing">
          <ul className="grid gap-6 md:grid-cols-3">
            {cases.map((useCase) => (
              <li key={useCase.slug}>
                <ContentCard
                  href={`/use-cases/${useCase.slug}`}
                  title={useCase.title}
                  description={useCase.description}
                  meta={useCase.persona}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
