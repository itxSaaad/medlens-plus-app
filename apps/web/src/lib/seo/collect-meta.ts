import type { SeoMeta } from "@medlens/types";
import {
  STATIC_PAGE_SLUGS,
  getAllBlogPosts,
  getAllGlossaryTerms,
  getAllUseCases,
  getBlogIndex,
  getGlossaryIndex,
  getHomeContent,
  getPageContent,
  getUseCasesIndex,
} from "@/lib/content/loader";

export interface SeoEntry {
  path: string;
  title: string;
  description: string;
  pageDescription?: string;
}

const BANNED_META_PHRASES = [
  "without diagnostic claims",
  "without diagnosing",
  "doctor-ready",
  "source-grounded",
  "safety-first",
] as const;

export function collectAllSeoEntries(): SeoEntry[] {
  const entries: SeoEntry[] = [];

  const home = getHomeContent();
  entries.push({
    path: "/",
    title: home.seo.title,
    description: home.seo.description,
  });

  for (const slug of STATIC_PAGE_SLUGS) {
    const page = getPageContent(slug);
    entries.push({
      path: `/${slug}`,
      title: page.seo.title,
      description: page.seo.description,
      pageDescription: page.description,
    });
  }

  const blogIndex = getBlogIndex();
  entries.push({
    path: "/blog",
    title: blogIndex.seo.title,
    description: blogIndex.seo.description,
    pageDescription: blogIndex.description,
  });

  for (const post of getAllBlogPosts()) {
    entries.push({
      path: `/blog/${post.slug}`,
      title: post.seo.title,
      description: post.seo.description,
      pageDescription: post.description,
    });
  }

  const glossaryIndex = getGlossaryIndex();
  entries.push({
    path: "/glossary",
    title: glossaryIndex.seo.title,
    description: glossaryIndex.seo.description,
    pageDescription: glossaryIndex.description,
  });

  for (const term of getAllGlossaryTerms()) {
    entries.push({
      path: `/glossary/${term.slug}`,
      title: term.seo.title,
      description: term.seo.description,
      pageDescription: term.description,
    });
  }

  const useCasesIndex = getUseCasesIndex();
  entries.push({
    path: "/use-cases",
    title: useCasesIndex.seo.title,
    description: useCasesIndex.seo.description,
    pageDescription: useCasesIndex.description,
  });

  for (const useCase of getAllUseCases()) {
    entries.push({
      path: `/use-cases/${useCase.slug}`,
      title: useCase.seo.title,
      description: useCase.seo.description,
      pageDescription: useCase.description,
    });
  }

  return entries;
}

export function getBannedMetaPhrases(): readonly string[] {
  return BANNED_META_PHRASES;
}

export function isValidSeoMeta(seo: SeoMeta): boolean {
  return seo.description.length > 0 && seo.description.length <= 160 && seo.title.length > 0;
}
