export interface SeoMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface ContentLink {
  label: string;
  href: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon?: string;
}

export interface StepItem {
  title: string;
  description: string;
  icon?: string;
}

export interface ComparisonRow {
  feature: string;
  medlens: boolean | string;
  pdfs: boolean | string;
  genericAi: boolean | string;
}

export interface UseCaseCard {
  slug: string;
  title: string;
  description: string;
  href: string;
}

export interface ProseSection {
  heading?: string;
  paragraphs: string[];
}

export interface SiteConfig {
  name: string;
  tagline: string;
  url: string;
  contactEmail: string;
  nav: NavLink[];
  footer: {
    product: NavLink[];
    resources: NavLink[];
    legal: NavLink[];
  };
  social: { label: string; href: string }[];
}

export interface BentoItem {
  title: string;
  description: string;
  icon?: string;
  span?: "default" | "wide" | "tall";
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface PageContent {
  slug: string;
  title: string;
  description: string;
  seo: SeoMeta;
  updatedAt: string;
  sections?: ProseSection[];
  faq?: FaqItem[];
  links?: ContentLink[];
  bento?: BentoItem[];
  pricing?: { tiers: PricingTier[] };
}

export interface HomeContent {
  seo: SeoMeta;
  hero: {
    eyebrow?: string;
    headline: string;
    subheadline: string;
    ctaLabel: string;
    privacyNote: string;
  };
  socialProof: { label: string }[];
  problem: {
    title: string;
    items: { title: string; description: string }[];
  };
  productPreview: {
    title: string;
    description: string;
  };
  steps: {
    title: string;
    items: StepItem[];
  };
  features: {
    title: string;
    items: FeatureItem[];
  };
  comparison: {
    title: string;
    rows: ComparisonRow[];
  };
  useCases: {
    title: string;
    items: UseCaseCard[];
  };
  trust: {
    title: string;
    description: string;
    items: string[];
  };
  faq: {
    title: string;
    items: FaqItem[];
  };
  finalCta: {
    title: string;
    description: string;
    ctaLabel: string;
  };
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  seo: SeoMeta;
  author: string;
  publishedAt: string;
  updatedAt: string;
  sections: ProseSection[];
  links?: ContentLink[];
  relatedPosts?: { slug: string; label: string }[];
  featured?: boolean;
}

export interface GlossaryTerm {
  slug: string;
  term: string;
  title: string;
  description: string;
  seo: SeoMeta;
  definition: string;
  sections: ProseSection[];
  relatedTerms?: { slug: string; label: string }[];
  links?: ContentLink[];
  updatedAt: string;
}

export interface UseCaseContent {
  slug: string;
  title: string;
  description: string;
  seo: SeoMeta;
  sections: ProseSection[];
  faq?: FaqItem[];
  links?: ContentLink[];
  persona?: string;
  updatedAt: string;
}
