# Lighthouse & Core Web Vitals checklist

Use with `web-performance` before/after perf-related PRs.

## Measure
- [ ] Lighthouse on production build (mobile + desktop)
- [ ] Field data if available (Search Console CWV, Vercel Analytics)
- [ ] Record LCP element selector and load delay breakdown

## LCP
- [ ] LCP image/text server-rendered in initial HTML
- [ ] `priority` on single LCP image only; correct `sizes`
- [ ] Hero not blocked by sync CSS/JS or font flash
- [ ] TTFB acceptable (CDN, no serial server waterfalls)

## INP / interactivity
- [ ] Minimal client JS on critical path
- [ ] Long tasks < 50ms where possible; `useTransition` for non-urgent updates
- [ ] Event handlers not over-debounced on clinical inputs

## CLS
- [ ] All images/video/embeds have reserved space
- [ ] Web fonts preloaded or fallback matched
- [ ] No layout shift from cookie banners / injected tags without reserved height

## Bundle
- [ ] No accidental barrel imports of large libs
- [ ] Dynamic import for below-fold heavy components
- [ ] `pnpm build` output reviewed for chunk size regressions

## Third parties
- [ ] GTM/pixels deferred or consent-gated
- [ ] Re-Lighthouse after any new tag

## MedLens
- [ ] Clinical dashboards still usable on mid-tier mobile (test real device)
- [ ] Loading states for async report data — no blank CLS flash
