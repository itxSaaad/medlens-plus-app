import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { ContentCard } from "@/components/marketing/content-card";
import { DotGrid } from "@/components/marketing/backgrounds/dot-grid";
import { JsonLdGroup } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, itemListSchema } from "@/lib/seo/schema";
import { getAllBlogPosts, getBlogIndex } from "@/lib/content/loader";
import { getSiteUrl } from "@/lib/utils";

export function generateMetadata(): Metadata {
  const index = getBlogIndex();
  return buildPageMetadata(index.seo, "/blog");
}

export default function BlogIndexPage() {
  const index = getBlogIndex();
  const posts = getAllBlogPosts();
  const siteUrl = getSiteUrl();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.slug !== featured?.slug);

  return (
    <>
      <JsonLdGroup
        items={[
          collectionPageSchema({
            title: index.title,
            description: index.description,
            url: `${siteUrl}/blog`,
          }),
          breadcrumbSchema([
            { name: "Home", url: siteUrl },
            { name: "Blog", url: `${siteUrl}/blog` },
          ]),
          itemListSchema(posts.map((p) => ({ name: p.title, url: `${siteUrl}/blog/${p.slug}` }))),
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
      <section className="relative overflow-hidden border-b border-border bg-surface py-16">
        <DotGrid />
        <div className="container-marketing relative">
          <h1>{index.title}</h1>
          <p className="prose-narrow mt-4 max-w-2xl text-lg">{index.description}</p>
        </div>
      </section>
      <div className="section-padding">
        <div className="container-marketing">
          {featured && (
            <ul className="grid gap-6 md:grid-cols-2">
              <ContentCard
                href={`/blog/${featured.slug}`}
                title={featured.title}
                description={featured.description}
                meta="Featured"
                featured
              />
            </ul>
          )}
          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <li key={post.slug}>
                <ContentCard
                  href={`/blog/${post.slug}`}
                  title={post.title}
                  description={post.description}
                  meta={new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
