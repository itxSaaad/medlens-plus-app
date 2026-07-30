# Shared Packages Strategy

Owns two things: the **Python↔TypeScript contract boundary** (how the FastAPI
backend and the TS frontend share models without sharing runtime code) and the
**shape and dependency discipline of every `packages/*` workspace package**.

It does **not** own how web and mobile _consume_ these packages (Tailwind vs
NativeWind, Metro, cookies vs SecureStore) — that platform-consumption boundary
is [../mobile/01-CROSS_PLATFORM_STRATEGY.md](../04-mobile/01-CROSS_PLATFORM_STRATEGY.md).
The two docs are deliberately complementary: this one defines _what a shared
package may contain_; that one defines _how each app wires it in_. Read them
together; neither duplicates the other.

## Decision

Do not force shared runtime code between Python and TypeScript. Cross the
language boundary with **generated type definitions only**, never runtime
logic.

## Why

- Different runtimes and packaging ecosystems.
- A shared runtime package adds coupling and release friction.
- A generated-contract boundary keeps both sides independently deployable while
  guaranteeing they agree on the wire shape.

## What Should Be Shared

1. Contract schemas (JSON Schema / OpenAPI) — see the generation pipeline below.
2. Architecture and policy docs.
3. Lint/quality conventions at repo level (`packages/config`).
4. Event contracts and IDs.

## Rule

If both apps need the same model, define it once in a contract schema and
generate language-specific types. Never hand-copy a model across the boundary.

## Cross-Language Generation Pipeline

`packages/schemas` is the single source of truth for every contract shared
between `apps/api` (Pydantic) and `apps/web` (Zod):

1. **Author once, in Zod**: `ReportDocument`, `LabObservation`,
   `ReferenceRange`, `ObservationTrend`, and the biomarker synonym/alias
   dictionary (see [../ai/01-EXTRACTION_PIPELINE.md](../03-ai/01-EXTRACTION_PIPELINE.md))
   are defined as Zod schemas in `packages/schemas/src/`.
2. **Export to JSON Schema**: a build step (`zod-to-json-schema`) emits
   `packages/schemas/dist/*.schema.json`.
3. **Generate Pydantic v2**: `datamodel-code-generator` consumes the JSON
   Schema output to produce `apps/api/src/api/domain/generated/*.py` models.
   Generated files are not hand-edited; regenerate on schema change.

This does not change the "no runtime sharing between Python and TypeScript"
rule above — only generated _type definitions_ cross the language boundary,
never runtime logic.

## Package Taxonomy

The authoritative list of `packages/*` and what each may contain. The
**runtime boundary** column is load-bearing: it constrains what code is legal
in the package (see Package-Shape Rules below).

| Package               | Role                                                                                                                                                                                    | Runtime boundary                                                                 |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `packages/schemas`    | Contract source of truth (Zod → JSON Schema → Pydantic + TS).                                                                                                                           | Build-time only; no app runtime imports the schemas directly.                    |
| `packages/types`      | Hand-written + schema-generated TS domain types (`LabObservation`, `FlagLevel`, `TrendDirection`, `BiomarkerKey`) **and** auth types (`User`, `Session`, `Role`, impersonation claims). | Pure types — zero runtime.                                                       |
| `packages/api-client` | Typed fetch client generated from FastAPI's OpenAPI spec (`openapi-typescript`). The **only** runtime boundary between the Python backend and any TS consumer.                          | Framework-agnostic `fetch` — no `next/*`, no DOM, no RN imports.                 |
| `packages/hooks`      | Business logic: TanStack Query hooks, flag/range computation, chart-series shaping, auth-aware query hooks. Platform-agnostic.                                                          | Plain TS + React (peer) — no DOM, no `next/*`, no `"use client"`/`"use server"`. |
| `packages/ui-tokens`  | Design tokens (flag colors, spacing/typography scale) as a plain token source. Tokens/theme **only**, never components.                                                                 | Plain data; consumed as Tailwind config on web, NativeWind on mobile.            |
| `packages/logger`     | Shared structured logging; PHI redaction enforced at this boundary.                                                                                                                     | Node/runtime utility.                                                            |
| `packages/config`     | Lint/formatter/tsconfig/Python presets.                                                                                                                                                 | Tooling config, not app runtime.                                                 |

Build these packages **now**, for web, before the Expo app exists, so the
boundary is enforced from day one and mobile becomes a later _consumer_ rather
than a future refactor.

## Package-Shape Rules (why the boundaries above are hard)

These rules exist because the same shared packages will later be bundled by
**Metro** (Expo's bundler) as well as Next.js. Metro and RSC do not mix, so a
shared package that is legal for Next.js today can silently break mobile later
unless these hold from the start:

- **React is a peer dependency, never a direct one.** In `packages/hooks` (and
  any package importing React), list `react`/`react-dom`/`react-native` under
  `peerDependencies`, not `dependencies`. Two copies of React in a monorepo is
  the #1 cause of the "Invalid hook call" bug — each app owns its own concrete
  React version and the shared package borrows it.
- **Shared packages stay plain, DOM-free, and framework-free.** No `"use
client"`/`"use server"` directives, no `next/*` imports, no `<div>`/DOM
  APIs. A single RSC-only or `next/*` import poisons the package for Metro.
  This is precisely why presentational/JSX components are **not** shared with
  mobile (that boundary is `01-CROSS_PLATFORM_STRATEGY.md`); only types, pure
  functions, and query hooks are.
- **Config is passed in as arguments, not read from a shared env module.**
  Next.js inlines `NEXT_PUBLIC_*` at build time; Expo uses
  `EXPO_PUBLIC_*`/`app.config`. A shared env module would bake one platform's
  convention into both. Each app reads its own env and passes config _into_
  shared code as function parameters.
- **Publish nothing to a registry.** Internal packages are referenced with
  workspace `"*"` versions; Turborepo caches `build`/`typecheck`/`lint` across
  them (repo already has `turbo.json`).

## Auth Sharing (types + injected client, never a client instance)

Auth is unified only at the **type/contract level**, not via a shared client:

- **Share auth types** (`User`, `Session`, `Role`, impersonation claims) in
  `packages/types`, and **share auth-aware query hooks** in `packages/hooks`.
- Those hooks receive an **already-initialized Supabase client via dependency
  injection** — passed in as a parameter. Do **not** share a Supabase client
  _instance_. Each app constructs its own client with its own storage adapter
  (web: `@supabase/ssr` cookie storage + PKCE; mobile: SecureStore, per
  `01-CROSS_PLATFORM_STRATEGY.md`) and injects it. This keeps the
  security-critical storage boundary platform-correct while role/permission
  logic (super-admin, audited impersonation) is defined once.
- **Server-side auth rule (repeated because it is a PHI-safety invariant):** in
  server code always gate pages and data with `supabase.auth.getUser()`, never
  `getSession()` — cookies can be spoofed, `getUser()` revalidates against
  Supabase. Web middleware refreshes expired tokens because Server Components
  cannot write cookies. See
  [../product/06-DASHBOARD_SPEC.md](../01-product/06-DASHBOARD_SPEC.md) for the
  dashboard cache-safety consequences.

## Scope Boundary With `01-CROSS_PLATFORM_STRATEGY.md`

To keep the two docs from drifting:

- **This doc**: package taxonomy, the Python↔TS generation pipeline,
  package-shape/dependency rules, auth type/DI sharing.
- **`01-CROSS_PLATFORM_STRATEGY.md`**: how web and mobile _consume_ the shared
  packages — Tailwind vs NativeWind token consumption, Metro `watchFolders`
  configuration, Expo env conventions, SecureStore vs cookie storage adapters,
  and which presentational JSX stays platform-specific.
