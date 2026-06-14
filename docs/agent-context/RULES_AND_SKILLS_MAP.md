# Rules and Skills Map

What loads when for Cursor and Claude Code on MedLens+.

## Cursor — always-on rules (max context discipline)

| Rule | File |
|------|------|
| Engineering standards | `.cursor/rules/engineering-standards.mdc` |
| Medical safety | `.cursor/rules/medical-safety.mdc` |
| Agent discipline | `.cursor/rules/agent-discipline.mdc` |
| Graphify exploration | `.cursor/rules/graphify.mdc` |

## Cursor — scoped rules

| Rule | Triggers on |
|------|-------------|
| `nextjs-frontend.mdc` | `apps/web/**`, `packages/types/**` |
| `fastapi-backend.mdc` | `apps/api/**` |
| `langgraph-ai-workflows.mdc` | `apps/api/**/workflows/**`, `packages/agents/**` |
| `testing.mdc` | test files |
| `devops-ci.mdc` | `.github/**`, Dockerfiles |
| `pr-quality-gate.mdc` | `apps/**`, `packages/**` |
| `github-delivery.mdc` | Agent-requested (issues/PRs) |
| `frontend-quality.mdc` | `apps/web/**` |
| `technical-seo.mdc` | `apps/web/**` |

## Claude — memory layers

| Layer | Location |
|-------|----------|
| Root entry | `CLAUDE.md` |
| Package context | `apps/web/CLAUDE.md`, `apps/api/CLAUDE.md` |
| Modular rules | `.claude/rules/agent-discipline.md` |
| Skills (on demand) | `.cursor/skills/<name>/SKILL.md` (mirrored in `.claude/skills/`) |
| Ignore noise | `.claudeignore` |

## Consolidated skills (18)

| Skill | Use when |
|-------|----------|
| `safety-privacy` | Medical safety, PHI, golden rules — **authoritative** |
| `project-delivery` | Pick issues, PRs, MVP shipping, branch promotion |
| `web-frontend` | In-app Next.js UI, RSC, controlled clinical UX (implementation) |
| `product-ux` | UX/UI design review — flows, heuristics, designer + dev POV |
| `ui-accessibility` | WCAG, UX audit, a11y, i18n, medical copy tone |
| `web-performance` | LCP, INP, CLS, Lighthouse, load times, bundle budget |
| `marketing-ui` | Landing/marketing visual design only — not report UI |
| `technical-seo` | Next.js metadata, sitemap, robots, JSON-LD |
| `content-seo` | On-page keywords, topic clusters, E-E-A-T copy |
| `answer-engine-optimization` | AEO / GEO — AI answer engines, citations, llms.txt |
| `analytics-tagging` | GTM, GA4, pixels, events — consent-safe, no PHI |
| `api-backend` | FastAPI, OpenAPI, Postgres, Python |
| `ai-workflows` | LangGraph, prompts, RAG, LLM governance |
| `parser-pipeline` | OCR, extractors, normalization |
| `testing` | Vitest, pytest, layered tests |
| `code-review` | PR review, security, Dependabot |
| `devops` | CI/CD, Docker, env, workflows |
| `debugging` | Logs, traces, Sentry, systematic debug |

Claude also: `graphify`, `medlens` index skill.

## Web experience stacks

### Discovery (public / marketing ranking)

| Layer | Skill |
|-------|-------|
| UX design review | `product-ux` |
| Visual design | `marketing-ui` |
| Technical SEO | `technical-seo` |
| Content & E-E-A-T | `content-seo` |
| AEO / GEO | `answer-engine-optimization` |
| Performance | `web-performance` |
| Analytics | `analytics-tagging` |
| a11y | `ui-accessibility` |

### In-app (clinical UI)

| Layer | Skill |
|-------|-------|
| UX design review | `product-ux` |
| Implementation | `web-frontend` |
| a11y | `ui-accessibility` |
| Performance | `web-performance` |

## Aesthetic split

| Surface | Skills |
|---------|--------|
| In-app health UI | `product-ux` + `web-frontend` + `ui-accessibility` + `web-performance` |
| Marketing / landing | Discovery stack above |

## Quick pick

| Task | Read first |
|------|------------|
| Any medical/AI output | `safety-privacy` |
| Pick up ticket | `project-delivery` |
| New API endpoint | `api-backend` |
| New in-app page | `product-ux` + `web-frontend` + `ui-accessibility` + `web-performance` |
| New landing / public page | `product-ux` + `marketing-ui` + discovery stack + `web-performance` |
| Lighthouse / LCP / CWV | `web-performance` + `/perf-review` |
| GTM / GA4 / pixels | `analytics-tagging` + `web-performance` (before/after) |
| UX flow or wireframe review | `product-ux` |
| SEO metadata / sitemap only | `technical-seo` |
| Blog / glossary content | `content-seo` + `answer-engine-optimization` + `safety-privacy` |
| UI audit | `/ui-audit` → `ui-accessibility` |
| Perf review | `/perf-review` → `web-performance` |
| LLM workflow | `ai-workflows` + `safety-privacy` |
| Lab parser | `parser-pipeline` + `testing` |
| CI change | `devops` |
| PR review | `code-review` |

## On-demand references

Upstream catalogs live under `references/<upstream-skill-name>/` inside each consolidated skill.  
Provenance: [`SKILLS_PROVENANCE.md`](./SKILLS_PROVENANCE.md)

Indexes: `.cursor/skills/README.md`, `.claude/skills/medlens/SKILL.md`
