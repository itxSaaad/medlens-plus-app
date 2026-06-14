# Next.js technical SEO checklist

Use with `technical-seo` skill when shipping or auditing public routes.

## Per public page
- [ ] Unique title (50–60 chars target) and meta description (150–160 chars)
- [ ] Canonical URL set
- [ ] OG title, description, image (1200×630), `og:type`
- [ ] Twitter card (`summary_large_image` when image exists)
- [ ] Single clear `h1`; headings nest correctly
- [ ] Core content visible in initial HTML (RSC/SSR)

## Site-wide
- [ ] `metadataBase` in root layout
- [ ] `sitemap.ts` lists only indexable URLs; `lastModified` accurate
- [ ] `robots.ts` blocks `/api`, auth, app dashboards; references sitemap
- [ ] No accidental `noindex` on marketing pages
- [ ] `noindex,nofollow` on patient/report routes

## Structured data
- [ ] JSON-LD validates (Rich Results Test)
- [ ] No PHI or user-specific values in schema
- [ ] No unverified medical claims in `description` fields

## Performance (SEO)
- [ ] LCP image prioritized; dimensions set
- [ ] No layout shift on hero/fonts (see `web-frontend` perf references)
- [ ] Critical CSS/fonts preloaded where needed

## MedLens YMYL
- [ ] Meta copy reviewed for golden rules (no diagnose/prescribe)
- [ ] Disclaimer present on marketing pages where appropriate
