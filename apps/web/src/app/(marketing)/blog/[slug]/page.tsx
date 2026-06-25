import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { ProseContent } from "@/components/marketing/prose-content";
import { RelatedLinks } from "@/components/marketing/related-links";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { JsonLdGroup } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { getAllBlogSlugs, getBlogPost } from "@/lib/content/loader";
import { getSiteUrl } from "@/lib/utils";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = getBlogPost(slug);
    return buildPageMetadata(post.seo, `/blog/${slug}`, {
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    });
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  let post;
  try {
    post = getBlogPost(slug);
  } catch {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/blog/${slug}`;
  const ogImage = post.seo.ogImage?.startsWith("http")
    ? post.seo.ogImage
    : `${siteUrl}${post.seo.ogImage ?? "/og/blog.svg"}`;

  const relatedLinks =
    post.links ??
    post.relatedPosts?.map((r) => ({ label: r.label, href: `/blog/${r.slug}` })) ??
    [];

  return (
    <>
      <JsonLdGroup
        items={[
          articleSchema({
            title: post.title,
            description: post.description,
            url,
            author: post.author,
            publishedAt: post.publishedAt,
            updatedAt: post.updatedAt,
            image: ogImage,
          }),
          breadcrumbSchema([
            { name: "Home", url: siteUrl },
            { name: "Blog", url: `${siteUrl}/blog` },
            { name: post.title, url },
          ]),
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />
      <article className="section-padding">
        <div className="container-marketing max-w-3xl">
          <header>
            <p className="text-sm text-muted">
              By {post.author} ·{" "}
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </p>
            <h1 className="mt-4">{post.title}</h1>
            <p className="prose-narrow mt-4 text-lg text-ink">{post.description}</p>
          </header>
          <div className="mt-12">
            <ProseContent sections={post.sections} />
          </div>
          {relatedLinks.length > 0 && <RelatedLinks links={relatedLinks} />}
          <p className="mt-12 rounded-lg border border-border bg-surface p-4 text-sm text-muted">
            This article is for education only. Talk with a qualified clinician about your lab
            results.
          </p>
        </div>
      </article>
      <CtaBanner
        title="Put your reports in order"
        description="Join the waitlist for timelines built from the PDFs you already have."
        ctaLabel="Join the waitlist"
      />
    </>
  );
}
