import type { FaqItem } from "@medlens/types";
import { getBrandName } from "@/lib/site/env";

export function organizationSchema(siteUrl: string, contactEmail: string, sameAs: string[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: getBrandName(),
    url: siteUrl,
    logo: `${siteUrl}/brand/logo-512.png`,
    email: contactEmail,
    description:
      "MedLens+ turns fragmented medical reports into a clear, safe, longitudinal health narrative for patients and doctors.",
    sameAs,
  };
}

export function webSiteSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: getBrandName(),
    url: siteUrl,
    description: "Lab report intelligence and doctor-ready timelines.",
  };
}

export function softwareApplicationSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: getBrandName(),
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    url: siteUrl,
    description:
      "Organize lab reports, track changes over time, and prepare focused questions for clinical visits.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Early access waitlist — free during public beta",
    },
  };
}

export function faqPageSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  url: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    author: { "@type": "Person", name: input.author },
    datePublished: input.publishedAt,
    dateModified: input.updatedAt,
    mainEntityOfPage: input.url,
    image: input.image,
  };
}

export function webPageSchema(input: {
  title: string;
  description: string;
  url: string;
  updatedAt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.title,
    description: input.description,
    url: input.url,
    dateModified: input.updatedAt,
  };
}

export function collectionPageSchema(input: { title: string; description: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.title,
    description: input.description,
    url: input.url,
  };
}

export function itemListSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function definedTermSchema(input: {
  term: string;
  definition: string;
  url: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: input.term,
    description: input.definition,
    url: input.url,
    inDefinedTermSet: `${input.url.split("/glossary/")[0]}/glossary`,
  };
}
