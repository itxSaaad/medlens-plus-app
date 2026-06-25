import type { Metadata } from "next";
import { LegalLayout } from "@/components/marketing/legal-layout";
import { JsonLdGroup } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schema";
import { getPageContent } from "@/lib/content/loader";
import { getSiteUrl } from "@/lib/utils";

function makeLegalPage(slug: "privacy" | "terms" | "security", eyebrow: string) {
  return function LegalPage() {
    const page = getPageContent(slug);
    const siteUrl = getSiteUrl();
    const url = `${siteUrl}/${slug}`;

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
        <div className="border-b border-border bg-surface py-8">
          <div className="container-marketing">
            <p className="text-sm font-semibold uppercase tracking-widest text-lens">{eyebrow}</p>
          </div>
        </div>
        {page.sections && (
          <LegalLayout
            title={page.title}
            description={page.description}
            updatedAt={page.updatedAt}
            sections={page.sections}
          />
        )}
      </>
    );
  };
}

export function makeLegalMetadata(slug: "privacy" | "terms" | "security"): Metadata {
  const page = getPageContent(slug);
  return buildPageMetadata(page.seo, `/${slug}`);
}

export const PrivacyPage = makeLegalPage("privacy", "Legal");
export const TermsPage = makeLegalPage("terms", "Legal");
export const SecurityPage = makeLegalPage("security", "Trust");
