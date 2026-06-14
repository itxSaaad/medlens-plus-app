---
name: web-performance
description: Core Web Vitals, Lighthouse, LCP/INP/CLS, load times, fonts, images, and third-party script impact for Next.js apps/web.
---

# Web Performance

Use when optimizing **load times, Lighthouse scores, and Core Web Vitals** — applies to public marketing pages and in-app UI.

Ranking and UX both depend on speed; pair with **`technical-seo`** for SEO impact and **`analytics-tagging`** before adding GTM/pixels (tags often hurt LCP).

## Targets (public marketing — aim green in Lighthouse)
| Metric | Target | Primary levers |
|--------|--------|----------------|
| **LCP** | ≤ 2.5s | SSR hero, priority image, font preload, no render-blocking third parties |
| **INP** | ≤ 200ms | Less client JS, transitions, debounce handlers |
| **CLS** | ≤ 0.1 | Image dimensions, font `size-adjust`, reserve ad/embed space |
| **TTFB** | ≤ 800ms | Edge caching, RSC data parallelization, avoid waterfalls |

## Next.js App Router
- Server Components for above-the-fold content; defer non-critical `"use client"` islands
- `next/image` — explicit `width`/`height`, `sizes`, `priority` only on LCP candidate
- `next/font` — subset fonts; avoid FOUT/CLS with `display: swap` + fallbacks
- Dynamic `import()` for heavy client widgets (charts, modals)
- Route-level `loading.tsx` + Suspense — perceived performance for clinical views
- `pnpm --filter @medlens/web build` — inspect bundle; trace barrel imports

## Lighthouse workflow
1. Production build locally or preview deploy
2. Chrome DevTools → Lighthouse (mobile + desktop)
3. Fix **Performance** diagnostics in order: LCP element, render-blocking, unused JS, image delivery
4. Re-run after **`analytics-tagging`** changes — tags are a common LCP regression

## Third-party scripts (GTM, pixels)
- Load tags **after** consent and **after** LCP where possible (`requestIdleCallback`, GTM defer, Partytown only if justified)
- Audit Network tab: count scripts, transfer size, main-thread blocking
- See **`analytics-tagging`** — never add pixels without perf budget check

## Load on demand
| Task | Reference |
|------|-----------|
| CWV + Lighthouse checklist | `references/lighthouse-cwv-checklist.md` |
| React/Next perf rules (70+) | `web-frontend` → `references/react-best-practices/rules/` |
| SEO perf tie-in | `technical-seo` |

Command: `/perf-review` · Rules: `.cursor/rules/nextjs-frontend.mdc`, `.cursor/rules/frontend-quality.mdc`
