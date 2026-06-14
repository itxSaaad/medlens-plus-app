---
name: content-seo
description: On-page content SEO for MedLens+ — search intent, topic clusters, internal linking, E-E-A-T, and YMYL-safe copy for ranking public pages.
---

# Content SEO

Use when planning **what to write and how to structure** public pages for traditional search ranking — complements **`technical-seo`** (implementation) and **`answer-engine-optimization`** (AI citations).

## MedLens constraints
- Health-adjacent YMYL: expertise and trust matter more than keyword stuffing
- Target informational intent (“how to organize lab reports”) not “symptoms of X”
- No fear-based or diagnostic headlines for clicks
- Align copy with `docs/product/GOLDEN_RULES.md`

## Search intent mapping
| Intent | Example topics | Page type |
|--------|----------------|-----------|
| Informational | “what is a CBC panel”, “how to read lab report” | Educational blog/docs |
| Commercial investigation | “lab report organizer app”, “track blood tests over time” | Landing, comparison |
| Transactional | “sign up”, “pricing” | Product/pricing pages |
| Navigational | “MedLens+” | Home, brand page |

One primary intent per URL; avoid cannibalizing the same keyword across pages.

## On-page essentials
- Primary keyword in `title`, `h1`, first paragraph, and URL slug (natural, not stuffed)
- Secondary terms in H2s and body
- Meta description sells the click with accurate value prop (150–160 chars)
- Image `alt` describes content; filenames descriptive where static assets allow

## Topic clusters (hub & spoke)
- **Hub** — pillar page (e.g. “Lab report intelligence guide”)
- **Spokes** — specific articles linking back to hub with descriptive anchor text
- Internal links: 3–5 contextual links per long article; footer nav for core product pages

## E-E-A-T signals (health-adjacent product)
- **Experience** — product screenshots, workflow descriptions (no fake testimonials)
- **Expertise** — clear explanation of what software does vs clinical judgment
- **Authoritativeness** — about page, security/privacy docs, consistent branding
- **Trust** — HTTPS, contact, privacy policy, no misleading claims

## Content types that rank for MedLens+
- How-to guides (upload, compare reports, prepare for doctor visit) — product truth only
- Glossary of lab/report terms (educational, non-diagnostic)
- Use cases (longitudinal tracking, multi-lab caution) — link to golden rules
- Comparison vs “PDF in folder” / generic note apps — factual

## Workflow
1. Keyword + intent research (manual or Search Console queries)
2. Outline: H1 → H2s → internal link targets
3. Draft with **`marketing-ui`** + **`safety-privacy`** review
4. Implement in Next.js; hand off metadata to **`technical-seo`**
5. Add FAQ blocks suitable for **`answer-engine-optimization`**

## Load on demand
| Task | Reference |
|------|-----------|
| Content SEO checklist | `references/content-seo-checklist.md` |
| Metadata implementation | `technical-seo` |
| AI citation structure | `answer-engine-optimization` |
