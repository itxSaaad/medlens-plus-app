# MedLens+ Agent Skills Index

Playbooks: `.claude/skills/<name>/SKILL.md` (mirrored in `.cursor/skills/`)  
Map: `docs/agent-context/RULES_AND_SKILLS_MAP.md` · Provenance: `docs/agent-context/SKILLS_PROVENANCE.md`

## Skills (18)

| Skill | When to use |
|-------|-------------|
| `safety-privacy` | Medical safety and PII — authoritative |
| `project-delivery` | GitHub Project, PRs, MVP, promotion |
| `web-frontend` | In-app Next.js implementation |
| `product-ux` | UX/UI design review (designer + dev) |
| `ui-accessibility` | WCAG, UX audit, a11y, i18n |
| `web-performance` | Lighthouse, LCP, INP, CLS, load times |
| `marketing-ui` | Marketing/landing visual design |
| `technical-seo` | Metadata, sitemap, JSON-LD |
| `content-seo` | On-page SEO, E-E-A-T |
| `answer-engine-optimization` | AEO / GEO, AI citations |
| `analytics-tagging` | GTM, GA4, pixels — no PHI |
| `api-backend` | FastAPI, OpenAPI, Postgres |
| `ai-workflows` | LangGraph, prompts, RAG |
| `parser-pipeline` | OCR, extractors |
| `testing` | Vitest, pytest |
| `code-review` | PR review, security |
| `devops` | CI/CD, Docker |
| `debugging` | Logs, traces |

## Slash commands

- `/review` — `code-review`
- `/test` — `testing`
- `/ui-audit` — `ui-accessibility`
- `/perf-review` — `web-performance`
- `/safety-review` — `safety-privacy`
- `/mvp-ticket` — `project-delivery`

Delivery board: https://github.com/users/itxSaaad/projects/2

Also: `graphify` skill for codebase graph queries.
