import type { Metadata } from "next";
import type { SeoMeta } from "@medlens/types";
import { getSiteUrl } from "@/lib/utils";

export function buildPageMetadata(
  seo: SeoMeta,
  pathname: string,
  options?: { type?: "website" | "article"; publishedTime?: string; modifiedTime?: string },
): Metadata {
  const url = `${getSiteUrl()}${pathname}`;
  const ogImage = seo.ogImage ?? "/og/default.svg";

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      siteName: "MedLens+",
      type: options?.type ?? "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: seo.title }],
      ...(options?.publishedTime ? { publishedTime: options.publishedTime } : {}),
      ...(options?.modifiedTime ? { modifiedTime: options.modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}
