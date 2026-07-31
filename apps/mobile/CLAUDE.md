# apps/mobile — Claude context

Expo Router mobile app (`@medlens/mobile`), built with React Native and TypeScript.

## Commands

```bash
pnpm --filter @medlens/mobile dev
pnpm --filter @medlens/mobile start
pnpm --filter @medlens/mobile lint
pnpm --filter @medlens/mobile typecheck
pnpm --filter @medlens/mobile test
pnpm --filter @medlens/mobile build
```

## Layout

- `src/app/` — file-based Expo Router screens and layouts
- `src/components/` — shared UI, themed wrappers, and app-shell pieces
- `src/constants/` — theme, spacing, and shared constants
- `src/hooks/` — reusable hooks
- `assets/images/` — app icons, logos, splash assets, and branding
- `assets/expo.icon/` — Expo icon assets
- Shared types: `@medlens/types` from `packages/types`
- Shared logger: `@medlens/logger` from `packages/logger`

## Conventions

- Use Expo Router file-based routing; keep screens in `src/app/` and shared UI in `src/components/`.
- Prefer typed contracts and shared package usage over duplicating logic in the app.
- Respect platform differences with `Platform.select` and cross-platform-safe patterns.
- Keep the mobile branding aligned with the web product assets and app identity.
- No medical interpretation logic in the UI; API owns clinical semantics.
- No PHI in logs or analytics; follow the repository safety and privacy guardrails.

## Guidance for agents

- Treat this app as an Expo Router + React Native project and follow the official Expo, Expo Router, and React Native guidance for navigation, asset handling, and platform-specific behavior.
- When introducing new components or native integrations, consult the official package documentation before implementing them.
- Keep the mobile experience consistent with the web and API apps by following shared contracts, package conventions, and repository safety rules.

## Skills by surface

**Mobile UI:** `product-ux`, `ui-accessibility`, `web-performance`

**Always:** `safety-privacy` for health-related copy and logging

Commands: `/ui-audit`, `/perf-review` · Map: `docs/00-start/03-RULES_AND_SKILLS_MAP.md`
