# apps/web

MedLens+ web application built with Next.js 16 and the App Router.

## Run locally

```bash
pnpm --filter @medlens/web dev
pnpm --filter @medlens/web lint
pnpm --filter @medlens/web typecheck
pnpm --filter @medlens/web test:unit
pnpm --filter @medlens/web test:integration
pnpm --filter @medlens/web build
```

## Project shape

- `src/app/` — routes, layouts, and route groups
- `src/components/` — shared UI and marketing components
- `src/content/data/` — content-backed copy and structured marketing data
- `src/lib/` — SEO, analytics, and content helpers
- `src/tests/` — unit and integration coverage

## Conventions

- Prefer Server Components by default and use client components only when necessary.
- Keep medical interpretation logic in the API layer instead of the UI.
- Follow the repository safety and privacy guardrails for any health-related copy.
- Use shared packages from `packages/types` and `packages/logger` where possible.

## Reference docs

- Next.js docs: [https://nextjs.org/docs](https://nextjs.org/docs)
- App Router docs: [https://nextjs.org/docs/app](https://nextjs.org/docs/app)
- Vercel/Next.js best practices: [https://nextjs.org/docs/app/building-your-application](https://nextjs.org/docs/app/building-your-application)
