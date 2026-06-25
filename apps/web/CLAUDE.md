# apps/web — Claude context

Next.js 16 frontend (`@medlens/web`).

## Commands

```bash
pnpm --filter @medlens/web dev
pnpm --filter @medlens/web lint
pnpm --filter @medlens/web typecheck
pnpm --filter @medlens/web test:unit
pnpm --filter @medlens/web test:integration
pnpm --filter @medlens/web build
```

## Layout
- `src/app/` — App Router pages and layouts
- `src/app/(marketing)/` — Public marketing routes (home, features, blog, glossary, etc.)
- `src/components/ui/` — shadcn-style primitives
- `src/components/marketing/` — Marketing section components
- `src/content/data/` — JSON content (CMS-ready)
- `src/lib/seo/`, `src/lib/analytics/`, `src/lib/content/` — SEO, GTM, content loaders
- `src/tests/unit/` — Vitest unit tests
- `src/tests/integration/` — integration tests
- Shared types: `@medlens/types` from `packages/types`
- Shared logger: `@medlens/logger` from `packages/logger`

## Conventions
- Server Components by default; `"use client"` only when needed.
- Marketing copy lives in JSON under `src/content/data/` — edit JSON, not components, for content changes.
- No medical interpretation logic in the UI — API owns clinical semantics.
- Accessible markup; no PII in client logs or analytics events.
- GTM loads only after analytics consent (`ConsentBanner`).

## Skills by surface

**In-app UI:** `product-ux`, `web-frontend`, `ui-accessibility`, `web-performance`

**Marketing / public:** `product-ux`, `marketing-ui`, `technical-seo`, `content-seo`, `answer-engine-optimization`, `web-performance`, `analytics-tagging`, `ui-accessibility`

**Always:** `safety-privacy` for health copy and tracking

Commands: `/ui-audit`, `/perf-review` · Map: `docs/agent-context/RULES_AND_SKILLS_MAP.md`
