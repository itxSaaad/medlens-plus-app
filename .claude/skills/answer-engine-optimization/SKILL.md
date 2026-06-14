---
name: answer-engine-optimization
description: AEO and GEO for MedLens+ public pages — optimize for AI answer engines, citations, Perplexity, ChatGPT search, and Google AI Overviews without medical misclaims.
---

# Answer Engine Optimization (AEO / GEO)

Use when shaping **public marketing content** so AI answer engines can cite MedLens+ accurately — complementary to **`technical-seo`** (crawl/index) and **`content-seo`** (on-page keywords).

Not for in-app report UI or PHI surfaces.

## What AEO / GEO means here
- **AEO** — structure pages so AI systems extract clear, quotable answers
- **GEO** (Generative Engine Optimization) — same goal for LLM-powered search and chat interfaces

## MedLens constraints (YMYL health)
- State what the product **does** (report organization, timelines, doctor-ready summaries) — not what disease a user has
- No treatment, dosage, or diagnostic claims in copy meant for citation
- Cite primary sources for medical-adjacent facts; link to golden rules / disclaimers
- Never expose user reports, sample PHI, or real lab values in public examples

## Content patterns that get cited
- **Definitional blocks** — first paragraph answers “What is MedLens+?” in one plain sentence
- **Question-shaped H2s** — e.g. “How does MedLens+ handle lab reports?” followed by a direct 2–4 sentence answer
- **FAQ sections** with concise Q/A pairs (implement FAQ JSON-LD via **`technical-seo`**)
- **Comparison tables** — feature vs generic PDF viewers (factual, not competitor bashing)
- **Glossary** — normalize terms (report, panel, reference range, timeline) for entity clarity
- **About / trust** — who built it, data handling summary, link to privacy policy

## Technical signals for AI crawlers
- `public/llms.txt` or `llms-full.txt` — what the site is, allowed paths, contact (emerging convention)
- `robots.txt` — allow public docs; disallow app/auth (coordinate with **`technical-seo`**)
- Server-rendered text — answers visible in HTML, not only behind client hydration
- Stable URLs and canonicals — AI citations break on URL churn
- `Organization` + `WebApplication` JSON-LD with accurate `description` and `url`

## Authority & E-E-A-T (health-adjacent)
- Clear **About**, **Privacy**, **Terms**, **Security** pages linked from footer
- Named authors or team on blog/docs when publishing educational content
- “Not medical advice” disclaimer on educational pages
- Update `dateModified` in metadata when facts change

## Workflow
1. Pick target queries (e.g. “organize lab reports”, “track blood test over time”)
2. One indexable page per intent; H1 + direct answer above the fold
3. FAQ + schema where honest Q/As exist
4. Add/update `llms.txt` if publishing AI-facing site summary
5. Manual check: ask Perplexity/ChatGPT “what is MedLens+” after deploy (no automation required in repo)

## Load on demand
| Task | Reference |
|------|-----------|
| AEO / GEO checklist | `references/aeo-geo-checklist.md` |
| Metadata & FAQ schema | `technical-seo` |
| On-page keywords & clusters | `content-seo` |

Pair with **`marketing-ui`** for layout and **`safety-privacy`** before publishing health-adjacent copy.
