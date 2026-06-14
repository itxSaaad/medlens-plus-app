---
name: web-frontend
description: Next.js 16 App Router, RSC performance, controlled clinical UI, and TypeScript for apps/web. Not for marketing or landing pages.
---

# Web Frontend

Use for `apps/web` and `@medlens/types` consumer code — **in-app health UI only**.

## MedLens constraints
- No medical interpretation in the UI — API owns clinical semantics
- Informational copy only; never diagnose or prescribe
- Server Components by default; `"use client"` only for interactivity
- No secrets or PII in client logs

## Workflow
1. Pages in `src/app/`; colocate tests under `src/tests/unit/` or `integration/`
2. Import types from `@medlens/types`
3. Run `pnpm --filter @medlens/web lint typecheck test:unit`

## Load on demand
| Task | Reference |
|------|-----------|
| RSC / bundle / perf | `references/react-best-practices/SKILL.md` → `rules/` by prefix |
| Compound component APIs | `references/composition-patterns/` |
| Controlled clinical UI | `references/bencium-controlled-ux-designer/` |
| App Router depth | `references/nextjs-developer/` |
| TypeScript strict patterns | `references/typescript-pro/` |

For marketing/landing aesthetics use **`marketing-ui`** — not this skill.

Commands: `/perf-review` · Deep CWV/Lighthouse: **`web-performance`** · Rules: `.cursor/rules/nextjs-frontend.mdc`, `.cursor/rules/frontend-quality.mdc`
