# Cross-Platform Strategy (Web <-> Mobile)

Scope: TypeScript-to-TypeScript sharing between `apps/web` (Next.js) and a
future Expo (React Native, iOS/Android) app. This is a **different**
boundary from
[05-SHARED_PACKAGES_STRATEGY.md](../02-architecture/05-SHARED_PACKAGES_STRATEGY.md),
which owns the Python<->TypeScript contract boundary only — that document
does not, and should not, describe web/mobile sharing.

No Expo app exists yet. This strategy is written now, ahead of that work,
specifically so `apps/web` does not need to be retrofitted later.

## What Is Shared

- **`packages/api-client`**: the OpenAPI-generated typed client (see
  `05-SHARED_PACKAGES_STRATEGY.md`) is framework-agnostic and consumed
  identically by `apps/web` today and the Expo app later — no duplication
  of endpoint definitions or response types.
- **`packages/types` / `packages/schemas`-generated TS types**: same domain
  types (`LabObservation`, `FlagLevel`, `TrendDirection`, etc.) used on both
  platforms.
- **Business-logic hooks** (`packages/hooks`): pure logic with no DOM/RN
  dependency (e.g. `useFlagColor(observation)`, `useTrendDirection(...)`,
  chart-**series shaping**, TanStack Query hooks) lives in a shared package and
  is imported by both apps. The package-shape rules that make this safe (React
  as a peer dependency, no `next/*`/DOM/`"use client"` imports) are defined in
  [05-SHARED_PACKAGES_STRATEGY.md](../02-architecture/05-SHARED_PACKAGES_STRATEGY.md#package-shape-rules-why-the-boundaries-above-are-hard)
  and are not repeated here.

Note on **charts specifically**: the _series-shaping logic_ is shared; the
_chart component_ is not. Web uses Recharts (SVG/DOM), which cannot run on
React Native; the Expo app picks its own native-renderer library (Victory
Native XL or similar) when it is built. Both feed identical pre-computed series
from `packages/hooks` into platform-native chart components — only the
rendering layer differs.

## `packages/ui-tokens`

New package (distinct from the existing `packages/config`, which is scoped
to lint/formatter/tsconfig/python presets, not design tokens). Holds
platform-neutral design tokens as a plain token source (flag colors for
green/yellow/red, spacing scale, typography scale) — a plain TS const
object or Style Dictionary format, not tied to Tailwind syntax at the
source level.

Consumed two ways:

- **Web**: Tailwind config extension reads from `packages/ui-tokens`,
  paired with shadcn/ui primitives (already the stack decision in
  `02-STACK_DECISIONS.md`).
- **Mobile (Expo, later)**: **NativeWind** (Tailwind utility syntax for
  React Native) consumes the same token source via its own Tailwind config
  — recommended over hand-porting tokens to RN `StyleSheet`, since it keeps
  one mental model and one source of truth across both platforms.

## Mobile-Consumption Mechanics

These are the Expo-side wiring details that pair with the shared-package
shape rules in `05-SHARED_PACKAGES_STRATEGY.md`:

- **Metro must watch the whole workspace.** Verify `metro.config.js`
  `watchFolders`/`nodeModulesPaths` include the repo root so Metro resolves the
  `packages/*` symlinks. Expo SDK 52+ auto-detects monorepos, but this is
  verified, not assumed.
- **Env vars differ by platform.** Expo reads `EXPO_PUBLIC_*`/`app.config`
  where web reads `NEXT_PUBLIC_*`. There is no shared env module; each app reads
  its own env and passes config **into** shared code as arguments.
- **RSC and Metro do not mix.** Any RSC-only or `next/*` import in a shared
  package breaks the Metro bundle — the reason presentational JSX and
  server-only code stay web-specific (below).

## Auth Storage (platform-specific adapter, shared types)

Auth is unified at the type/contract level only (see
[05-SHARED_PACKAGES_STRATEGY.md](../02-architecture/05-SHARED_PACKAGES_STRATEGY.md#auth-sharing-types--injected-client-never-a-client-instance)):

- **Web**: `@supabase/ssr` with cookie storage + PKCE; middleware refreshes
  expired tokens. Server code gates with `getUser()`, never `getSession()`.
- **Mobile (Expo)**: token-based session in a **SecureStore** storage adapter
  (AsyncStorage fallback for RN-web) — the documented Supabase Expo pattern.
- Each app constructs its own Supabase client with its own storage adapter and
  **injects** it into the shared auth hooks. A Supabase client _instance_ is
  never shared, only the `User`/`Session`/`Role`/impersonation **types** and
  the DI'd hooks.

## What Is Not Shared

React Server Components and DOM-specific component JSX are **not** shared
with Expo — RSC and DOM primitives (`<div>`, `<button>`) do not map to React
Native primitives (`<View>`, `<Pressable>`). Presentational components stay
platform-specific, written independently for each app, but stay visually
consistent because both consume the same `packages/ui-tokens` source.

## Boundary Summary

| Layer                                | Shared web<->mobile?                           |
| ------------------------------------ | ---------------------------------------------- |
| API client (`packages/api-client`)   | Yes                                            |
| Domain types/schemas                 | Yes                                            |
| Business-logic hooks (no DOM/RN dep) | Yes                                            |
| Design tokens (`packages/ui-tokens`) | Yes (via Tailwind config vs NativeWind config) |
| Presentational components (JSX)      | No — platform-specific, token-driven           |
| RSC / server-only code               | No — web-only                                  |
