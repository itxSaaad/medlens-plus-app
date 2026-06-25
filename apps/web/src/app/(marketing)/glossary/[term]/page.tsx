import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { ProseContent } from "@/components/marketing/prose-content";
import { RelatedLinks } from "@/components/marketing/related-links";
import { JsonLdGroup } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, definedTermSchema, webPageSchema } from "@/lib/seo/schema";
import { getAllGlossarySlugs, getGlossaryTerm } from "@/lib/content/loader";
import { getSiteUrl } from "@/lib/utils";

interface GlossaryTermPageProps {
  params: Promise<{ term: string }>;
}

export async function generateStaticParams() {
  return getAllGlossarySlugs().map((term) => ({ term }));
}

export async function generateMetadata({ params }: GlossaryTermPageProps): Promise<Metadata> {
  const { term: slug } = await params;
  try {
    const entry = getGlossaryTerm(slug);
    return buildPageMetadata(entry.seo, `/glossary/${slug}`);
  } catch {
    return {};
  }
}

export default async function GlossaryTermPage({ params }: GlossaryTermPageProps) {
  const { term: slug } = await params;

  let entry;
  try {
    entry = getGlossaryTerm(slug);
  } catch {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/glossary/${slug}`;

  return (
    <>
      <JsonLdGroup
        items={[
          webPageSchema({
            title: entry.title,
            description: entry.description,
            url,
            updatedAt: entry.updatedAt,
          }),
          definedTermSchema({
            term: entry.term,
            definition: entry.definition,
            url,
            description: entry.description,
          }),
          breadcrumbSchema([
            { name: "Home", url: siteUrl },
            { name: "Glossary", url: `${siteUrl}/glossary` },
            { name: entry.term, url },
          ]),
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Glossary", href: "/glossary" },
          { label: entry.term },
        ]}
      />
      <article className="section-padding">
        <div className="container-marketing max-w-3xl">
          <header>
            <p className="font-sans text-sm font-semibold uppercase tracking-wide text-lens">
              Glossary
            </p>
            <h1 className="mt-2">{entry.term}</h1>
            <p className="prose-narrow mt-4 text-lg font-medium text-ink">{entry.definition}</p>
          </header>
          <div className="mt-12">
            <ProseContent sections={entry.sections} />
          </div>
          {entry.relatedTerms && entry.relatedTerms.length > 0 && (
            <nav
              aria-label="Related terms"
              className="mt-12 rounded-xl border border-border bg-surface p-6"
            >
              <h2 className="font-sans text-sm font-semibold uppercase tracking-wide text-muted">
                Related terms
              </h2>
              <ul className="mt-4 flex flex-wrap gap-3">
                {entry.relatedTerms.map((related) => (
                  <li key={related.slug}>
                    <Link
                      href={`/glossary/${related.slug}`}
                      className="rounded-full border border-border bg-paper px-4 py-1.5 text-sm hover:border-lens hover:text-lens"
                    >
                      {related.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          {entry.links && entry.links.length > 0 && (
            <RelatedLinks title="Learn more" links={entry.links} />
          )}
        </div>
      </article>
    </>
  );
}
