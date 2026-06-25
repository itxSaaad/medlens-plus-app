import fs from "node:fs";
import path from "node:path";
import type {
  BlogPost,
  GlossaryTerm,
  HomeContent,
  PageContent,
  SiteConfig,
  UseCaseContent,
} from "@medlens/types";
import { getContactEmail, getGithubUrl, getSiteUrl } from "@/lib/site/env";
import {
  blogIndexSchema,
  blogPostSchema,
  glossaryIndexSchema,
  glossaryTermSchema,
  homeContentSchema,
  pageContentSchema,
  siteConfigSchema,
  useCaseContentSchema,
  useCasesIndexSchema,
} from "@/content/schemas";
import { webLogger } from "@/lib/logger";

const contentRoot = path.join(process.cwd(), "src/content/data");

function readJson<T>(relativePath: string, schema: { parse: (data: unknown) => T }): T {
  const fullPath = path.join(contentRoot, relativePath);
  try {
    const raw = fs.readFileSync(fullPath, "utf-8");
    return schema.parse(JSON.parse(raw));
  } catch (error) {
    webLogger.error("Failed to load content", { path: relativePath });
    throw error;
  }
}

function readJsonDirectory<T>(dir: string, schema: { parse: (data: unknown) => T }): T[] {
  const fullDir = path.join(contentRoot, dir);
  if (!fs.existsSync(fullDir)) {
    return [];
  }
  return fs
    .readdirSync(fullDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => readJson(`${dir}/${file}`, schema));
}

export function getSiteConfig(): SiteConfig {
  const raw = readJson("site.json", siteConfigSchema);
  const githubUrl = getGithubUrl();

  return {
    ...raw,
    url: getSiteUrl(),
    contactEmail: getContactEmail(),
    social: raw.social.map((item) => ({
      ...item,
      href: item.href === "GITHUB_URL" ? githubUrl : item.href,
    })),
  };
}

export function getHomeContent(): HomeContent {
  return readJson("home.json", homeContentSchema);
}

export function getPageContent(slug: string): PageContent {
  return readJson(`pages/${slug}.json`, pageContentSchema);
}

export function getBlogIndex() {
  return readJson("blog/index.json", blogIndexSchema);
}

export function getAllBlogPosts(): BlogPost[] {
  return readJsonDirectory("blog/posts", blogPostSchema).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getBlogPost(slug: string): BlogPost {
  return readJson(`blog/posts/${slug}.json`, blogPostSchema);
}

export function getAllBlogSlugs(): string[] {
  return getAllBlogPosts().map((post) => post.slug);
}

export function getGlossaryIndex() {
  return readJson("glossary/index.json", glossaryIndexSchema);
}

export function getAllGlossaryTerms(): GlossaryTerm[] {
  return readJsonDirectory("glossary/terms", glossaryTermSchema).sort((a, b) =>
    a.term.localeCompare(b.term),
  );
}

export function getGlossaryTerm(slug: string): GlossaryTerm {
  return readJson(`glossary/terms/${slug}.json`, glossaryTermSchema);
}

export function getAllGlossarySlugs(): string[] {
  return getAllGlossaryTerms().map((term) => term.slug);
}

export function getUseCasesIndex() {
  return readJson("use-cases/index.json", useCasesIndexSchema);
}

export function getAllUseCases(): UseCaseContent[] {
  return readJsonDirectory("use-cases/cases", useCaseContentSchema);
}

export function getUseCase(slug: string): UseCaseContent {
  return readJson(`use-cases/cases/${slug}.json`, useCaseContentSchema);
}

export function getAllUseCaseSlugs(): string[] {
  return getAllUseCases().map((useCase) => useCase.slug);
}

export const STATIC_PAGE_SLUGS = [
  "features",
  "pricing",
  "about",
  "how-it-works",
  "faq",
  "privacy",
  "terms",
  "security",
] as const;

export function getAllStaticRoutes(): string[] {
  return [
    "/",
    ...STATIC_PAGE_SLUGS.map((slug) => `/${slug}`),
    "/blog",
    ...getAllBlogSlugs().map((slug) => `/blog/${slug}`),
    "/glossary",
    ...getAllGlossarySlugs().map((slug) => `/glossary/${slug}`),
    "/use-cases",
    ...getAllUseCaseSlugs().map((slug) => `/use-cases/${slug}`),
  ];
}
