---
name: technical-seo
description: Next.js 16 App Router technical SEO — metadata, sitemaps, robots, structured data, Core Web Vitals, and crawlability for MedLens+ public pages.
---

# Technical SEO (Next.js)

Use when improving **discoverability and crawlability** of public/marketing surfaces in `apps/web` — not for in-app authenticated report UI.

Pair with **`marketing-ui`** for landing copy/design, **`content-seo`** for on-page strategy, **`answer-engine-optimization`** for AI citations, and **`web-frontend`** for RSC performance (CWV affects rankings).

## Discovery stack (public pages)
| Layer | Skill |
|-------|-------|
| Code, crawl, CWV | `technical-seo` (this skill) |
| Keywords, clusters, E-E-A-T | `content-seo` |
| AEO / GEO, llms.txt, FAQ citations | `answer-engine-optimization` |

## MedLens constraints (YMYL / health)
- Meta titles/descriptions: factual product positioning only — no disease claims or treatment promises
- Structured data: `WebApplication` / `Organization` / `SoftwareApplication` — not `MedicalWebPage` with diagnostic claims unless lawyer-reviewed
- No PHI in URLs, JSON-LD, or open graph tags
- `robots` / `noindex` on authenticated app routes, dashboards, and any PHI surfaces

## Next.js App Router checklist

### Metadata (`generateMetadata` / `export const metadata`)
- Unique `title` + `description` per public route; template in root `layout.tsx`
- `metadataBase` set to production URL (env-backed)
- `alternates.canonical` on every indexable page
- Open Graph + Twitter cards (`openGraph`, `twitter`) with absolute image URLs
- `robots: { index, follow }` explicit on public pages; `noindex` on app-only routes

### Files (App Router conventions)
- `app/sitemap.ts` — dynamic sitemap; only public URLs
- `app/robots.ts` — allow/disallow; link sitemap URL
- `app/manifest.ts` or `manifest.webmanifest` if PWA metadata needed

### HTML semantics
- One `h1` per page; logical heading order
- `lang` on `<html>` (root layout)
- Descriptive `alt` on content images; decorative images `alt=""`
- Internal links use `<Link>` with meaningful anchor text

### Structured data (JSON-LD)
- Inject via `<script type="application/ld+json">` in Server Components
- Validate with Google Rich Results Test before shipping
- Prefer static JSON-LD built from typed config in `apps/web` — no user data in schema

### Performance (ranking signal)
- Server-render critical content; avoid client-only hero text
- **`web-performance`** — LCP, INP, CLS, Lighthouse workflow
- **`web-frontend`** → `references/react-best-practices/` for implementation rules
- Use `next/image` with explicit `width`/`height`; priority on LCP image only

### i18n (when locales ship)
- `hreflang` via `alternates.languages` in metadata
- Localized slugs or consistent URL strategy documented per locale

## Workflow
1. Audit route: public vs `noindex`
2. Implement metadata + canonical + OG for indexable routes
3. Update `sitemap.ts` / `robots.ts`
4. Add JSON-LD only where accurate
5. Verify: View Source, Lighthouse SEO, Search Console URL inspection (manual)

## Commands
```bash
pnpm --filter @medlens/web build
pnpm --filter @medlens/web lint typecheck
```

## Load on demand
| Task | Reference |
|------|-----------|
| SEO implementation checklist | `references/nextjs-seo-checklist.md` |
| RSC / CWV perf | `web-frontend` → `references/react-best-practices/` |
| Analytics / tags impact on LCP | `analytics-tagging` |

Rule: `.cursor/rules/technical-seo.mdc`
