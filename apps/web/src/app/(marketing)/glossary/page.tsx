import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { ContentCard } from "@/components/marketing/content-card";
import { DotGrid } from "@/components/marketing/backgrounds/dot-grid";
import { JsonLdGroup } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, itemListSchema } from "@/lib/seo/schema";
import { getAllGlossaryTerms, getGlossaryIndex } from "@/lib/content/loader";
import { getSiteUrl } from "@/lib/utils";

export function generateMetadata(): Metadata {
  const index = getGlossaryIndex();
  return buildPageMetadata(index.seo, "/glossary");
}

export default function GlossaryIndexPage() {
  const index = getGlossaryIndex();
  const terms = getAllGlossaryTerms();
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLdGroup
        items={[
          collectionPageSchema({
            title: index.title,
            description: index.description,
            url: `${siteUrl}/glossary`,
          }),
          breadcrumbSchema([
            { name: "Home", url: siteUrl },
            { name: "Glossary", url: `${siteUrl}/glossary` },
          ]),
          itemListSchema(
            terms.map((t) => ({ name: t.term, url: `${siteUrl}/glossary/${t.slug}` })),
          ),
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Glossary" }]} />
      <section className="relative overflow-hidden border-b border-border bg-surface py-16">
        <DotGrid />
        <div className="container-marketing relative">
          <h1>{index.title}</h1>
          <p className="prose-narrow mt-4 max-w-2xl text-lg">{index.description}</p>
        </div>
      </section>
      <div className="section-padding">
        <div className="container-marketing">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {terms.map((term) => (
              <li key={term.slug}>
                <ContentCard
                  href={`/glossary/${term.slug}`}
                  title={term.term}
                  description={term.description}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
