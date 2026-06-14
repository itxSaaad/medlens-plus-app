---
name: analytics-tagging
description: GTM, GA4, marketing pixels, event tracking, and consent-safe tag loading for apps/web without PHI in analytics.
---

# Analytics & Tagging

Use when adding or changing **Google Tag Manager, GA4, Meta/TikTok/LinkedIn pixels, Hotjar, Clarity**, or custom event tracking on public or app surfaces.

**Always** coordinate with **`web-performance`** — tags are the #1 cause of LCP regressions.

## MedLens privacy (non-negotiable)
- **No PHI in analytics** — no report values, patient IDs, diagnoses, or file names with health data in events
- Hash or omit user identifiers; use opaque internal IDs only if legal/privacy reviewed
- Authenticated report routes: prefer **no marketing pixels**; minimal product analytics only with consent
- Document new events in PR privacy notes; align with `safety-privacy`

## Architecture (Next.js)
- Prefer **single container** (GTM) vs many hardcoded pixels
- Load GTM via `next/script` with `strategy="afterInteractive"` or later if consent allows
- **Consent Mode v2** (EEA/UK) before non-essential tags fire
- Environment-specific containers: dev/staging should not pollute production GA4
- Use dataLayer pushes from Server Components only for non-PII page context

## Event design
| Layer | Examples |
|-------|----------|
| Page | `page_view` with route name — no query params with sensitive data |
| Marketing | `cta_click`, `signup_start`, `pricing_view` |
| Product (careful) | `report_upload_started` — counts only, no metadata |

Naming: `object_action` lowercase (`cta_click`, `nav_open`). Document in `references/event-taxonomy.md` when introduced.

## GTM hygiene
- Version containers; test in Preview mode
- Fewer tags = faster site; merge redundant pixels
- Triggers: DOM ready vs window loaded — prefer least blocking
- No duplicate GA4 config tags

## Performance checklist before merge
1. Lighthouse before/after tag change
2. Network: total third-party KB and main-thread time
3. If LCP +200ms, defer tag or load on interaction

## Load on demand
| Task | Reference |
|------|-----------|
| GTM / consent / pixels checklist | `references/gtm-ga4-checklist.md` |
| Event naming stub | `references/event-taxonomy.md` |
| CWV impact | `web-performance` |

Pair with **`content-seo`** / **`technical-seo`** for conversion pages being measured.
