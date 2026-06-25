import { z } from "zod";

export const seoMetaSchema = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()).optional(),
  ogImage: z.string().optional(),
});

export const navLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
  category: z.string().optional(),
});

export const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const siteConfigSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  nav: z.array(navLinkSchema),
  footer: z.object({
    product: z.array(navLinkSchema),
    resources: z.array(navLinkSchema),
    legal: z.array(navLinkSchema),
  }),
  social: z.array(z.object({ label: z.string(), href: z.string() })),
});

export const homeContentSchema = z.object({
  seo: seoMetaSchema,
  hero: z.object({
    eyebrow: z.string().optional(),
    headline: z.string(),
    subheadline: z.string(),
    ctaLabel: z.string(),
    privacyNote: z.string(),
  }),
  socialProof: z.array(z.object({ label: z.string() })),
  problem: z.object({
    title: z.string(),
    items: z.array(z.object({ title: z.string(), description: z.string() })),
  }),
  productPreview: z.object({
    title: z.string(),
    description: z.string(),
  }),
  steps: z.object({
    title: z.string(),
    items: z.array(
      z.object({ title: z.string(), description: z.string(), icon: z.string().optional() }),
    ),
  }),
  features: z.object({
    title: z.string(),
    items: z.array(
      z.object({ title: z.string(), description: z.string(), icon: z.string().optional() }),
    ),
  }),
  comparison: z.object({
    title: z.string(),
    rows: z.array(
      z.object({
        feature: z.string(),
        medlens: z.union([z.boolean(), z.string()]),
        pdfs: z.union([z.boolean(), z.string()]),
        genericAi: z.union([z.boolean(), z.string()]),
      }),
    ),
  }),
  useCases: z.object({
    title: z.string(),
    items: z.array(
      z.object({
        slug: z.string(),
        title: z.string(),
        description: z.string(),
        href: z.string(),
      }),
    ),
  }),
  trust: z.object({
    title: z.string(),
    description: z.string(),
    items: z.array(z.string()),
  }),
  faq: z.object({
    title: z.string(),
    items: z.array(faqItemSchema),
  }),
  finalCta: z.object({
    title: z.string(),
    description: z.string(),
    ctaLabel: z.string(),
  }),
});

export const pageContentSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  seo: seoMetaSchema,
  updatedAt: z.string(),
  sections: z
    .array(
      z.object({
        heading: z.string().optional(),
        paragraphs: z.array(z.string()),
      }),
    )
    .optional(),
  faq: z.array(faqItemSchema).optional(),
  links: z.array(linkSchema).optional(),
  bento: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string().optional(),
        span: z.enum(["default", "wide", "tall"]).optional(),
      }),
    )
    .optional(),
  pricing: z
    .object({
      tiers: z.array(
        z.object({
          name: z.string(),
          price: z.string(),
          description: z.string(),
          features: z.array(z.string()),
          highlighted: z.boolean().optional(),
        }),
      ),
    })
    .optional(),
});

export const blogPostSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  seo: seoMetaSchema,
  author: z.string(),
  publishedAt: z.string(),
  updatedAt: z.string(),
  sections: z.array(
    z.object({
      heading: z.string().optional(),
      paragraphs: z.array(z.string()),
    }),
  ),
  links: z.array(linkSchema).optional(),
  relatedPosts: z.array(z.object({ slug: z.string(), label: z.string() })).optional(),
  featured: z.boolean().optional(),
});

export const glossaryTermSchema = z.object({
  slug: z.string(),
  term: z.string(),
  title: z.string(),
  description: z.string(),
  seo: seoMetaSchema,
  definition: z.string(),
  sections: z.array(
    z.object({
      heading: z.string().optional(),
      paragraphs: z.array(z.string()),
    }),
  ),
  relatedTerms: z.array(z.object({ slug: z.string(), label: z.string() })).optional(),
  links: z.array(linkSchema).optional(),
  updatedAt: z.string(),
});

export const useCaseContentSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  seo: seoMetaSchema,
  sections: z.array(
    z.object({
      heading: z.string().optional(),
      paragraphs: z.array(z.string()),
    }),
  ),
  faq: z.array(faqItemSchema).optional(),
  links: z.array(linkSchema).optional(),
  persona: z.string().optional(),
  updatedAt: z.string(),
});

export const blogIndexSchema = z.object({
  title: z.string(),
  description: z.string(),
  seo: seoMetaSchema,
});

export const glossaryIndexSchema = blogIndexSchema;
export const useCasesIndexSchema = blogIndexSchema;
