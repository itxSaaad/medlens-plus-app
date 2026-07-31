# Dashboard Spec

Full spec for both the patient/caregiver dashboard and the super-admin
console. Compliance rules live in [03-GOLDEN_RULES.md](./03-GOLDEN_RULES.md) and
are referenced, not duplicated, here. Flow-level detail (screens/states) is
in [05-USER_JOURNEYS.md](./05-USER_JOURNEYS.md); schema referenced below is in
[03-DATA_MODEL.md](../02-architecture/03-DATA_MODEL.md).

## User Dashboard — Two-Tier Structure

The user dashboard is explicitly **two tiers**, not one flat screen: an
aggregate overview answering "how am I doing overall," and a per-date/
per-upload detail answering "what exactly did this report say."

### Tier 1 — Overview

- One card per report category (CBC, LFT, KFT/RFT, Lipid Profile, HbA1c,
  Thyroid Profile, Vitamin D, Vitamin B12 — the 8 MVP types from
  [04-MVP_V1_SPEC.md](./04-MVP_V1_SPEC.md)).
- Each card shows: latest overall flag for that category (green/yellow/red)
  and the last-tested date.
- A top-level "needs attention" banner renders whenever any category is
  yellow or red.
- This is the landing/home view. It intentionally does not show individual
  biomarker values — that's Tier 2.

**Frontend framing**: Tier 1 is **pure React Server Components** (Next.js 16
App Router). The aggregate is static-shaped, read-heavy, and per-user, so it
is fetched server-side directly against the FastAPI backend (via the
generated `packages/api-client`) with no client bundle cost and **no TanStack
Query** — client-side data fetching is reserved for Tier 2. Wrap each
category card in its own `<Suspense>` boundary so the shell and fast cards
paint immediately while a slower category aggregation streams in, rather than
blocking the whole grid on the slowest query.

**Cache safety (hard rule)**: this is per-user PHI, so it is fetched
**dynamic/uncached** at the Next.js layer. Since Next.js 15, `fetch` is not
cached by default — keep it that way: never wrap a user-scoped fetch in
`"use cache"` (the Next.js 16 Cache Components model). Authenticate server
code with `supabase.auth.getUser()`, never `getSession()` (cookies can be
spoofed; `getUser()` revalidates against Supabase), and run the tenant
authorization check **inside** the data-fetching layer itself, not only in
middleware, so a mis-scoped query can never return another user's rows even
if a route guard is missed. If a cache tag is ever introduced for user data
it MUST be namespaced with the user id (`labs/${userId}`) and revalidation
must target that scoped tag — never a global `labs` tag, which combined with
a shared cache key is a known cross-tenant PHI-leak bug. See
[05-USER_JOURNEYS.md](./05-USER_JOURNEYS.md) and
[../architecture/05-SHARED_PACKAGES_STRATEGY.md](../02-architecture/05-SHARED_PACKAGES_STRATEGY.md).

### Tier 2 — Per-Date / Per-Upload Detail

- Reached by clicking a Tier 1 card (jumps to the most recent upload in that
  category) or by clicking a specific date in the chronological "all
  uploads" list.
- Shows every extracted biomarker for that specific `report_document`: value,
  unit, **that report's own** `reference_range` (never a generic/global
  range — Golden Rule #6), flag, and the safety-filtered summary generated
  for that report.
- "View original scan" toggle against the stored file.

**Frontend framing**: Tier 2 is the **one** interactive surface that uses
TanStack Query, via the server-prefetch + `HydrationBoundary` pattern:
prefetch the report/observations on a per-request `QueryClient` inside the
RSC, `dehydrate` it into `<HydrationBoundary>`, and read it client-side with
`useQuery` for a populated first paint. Set a non-zero `staleTime` (e.g. 60s)
globally — with the default `staleTime: 0` the hydrated data is treated as
stale and immediately refetched on mount, wasting the prefetch. The `queryFn`
calls the FastAPI backend through `packages/api-client`; **do not** use a
Next.js Server Action as the `queryFn` (Server Actions run serially and fight
the refetch model). Give each independently-slow panel (each chart) its own
`<Suspense>` boundary so the shell streams.

**Cache safety (hard rule)**: Tier 2's only cache is TanStack Query's
client-side cache, which is per-browser-session and cannot leak across users.
The same server-side rules as Tier 1 apply to the prefetch: `getUser()` not
`getSession()`, authorization inside the data layer, and no user-scoped
Next.js Data Cache entry for PHI.

### Flag Computation

Deterministic, computed only from the specific report's own
`reference_range` row — never a global/generic range table
(Golden Rule #6):

- **Green**: value within `[low, high]`.
- **Yellow**: value outside `[low, high]` but within a configurable
  "borderline band" (e.g., within 10-15% of the boundary). This band width
  is a tunable config value (`feature_flag`-adjacent, not hardcoded) and
  must be labeled in-product as a heuristic, not a clinical claim.
- **Red**: value beyond the borderline band, or a qualitative critical
  marker (e.g., "Reactive"/"Positive" where positive is inherently
  notable).

### Clinical Presentation Conventions (evidence-based, not optional style)

These are product rules, not visual preference. Bright alarm colors
measurably raise patient anxiety even for benign results; anxiety should
attach to the written conclusion, not the color stimulus.

- **Soft, desaturated status colors** — never an "emergency siren" red. The
  green/yellow/red scale communicates status calmly.
- **Never color alone.** Every status indicator pairs the color with an icon
  **and** a plain-language text label ("In range", "Slightly high"). Required
  for WCAG 1.4.1 and colorblind users; it also lowers raw-color alarm.
- **Always show the reference range and the value's position in it.** A range
  bar with a marker reads calmer than a bare colored dot, and it makes "out of
  range" contextual rather than a flashing signal.
- **Aggregate "needs attention" into one calm sentence** (e.g. "2 values are
  outside their usual range") linking to detail, rather than scattering red
  badges across the UI. The Tier 1 banner uses this framing.
- **Standing disclaimer that abnormal ≠ emergency**, non-alarmist and always
  present on flagged views — a medical-safety requirement, aligned with the
  "should say instead" language in [03-GOLDEN_RULES.md](./03-GOLDEN_RULES.md)
  (rules #1, #4, #5). An LLM never decides a flag color; flags are
  deterministic (see Flag Computation above).

### Charting and Client State

- **Recharts** (SVG/DOM, composable) is the pinned web charting library for
  both Tier 1 sparklines and Tier 2 longitudinal charts. It renders to the
  DOM and therefore **cannot** be shared with the future Expo app — that
  boundary is explicit; mobile picks its own native-renderer library later.
  What _is_ shared cross-platform is the data-shaping logic (series building,
  range/flag computation) in `packages/hooks`; both platforms feed identical
  pre-computed series into platform-native chart components. See
  [../architecture/05-SHARED_PACKAGES_STRATEGY.md](../02-architecture/05-SHARED_PACKAGES_STRATEGY.md)
  and [../mobile/01-CROSS_PLATFORM_STRATEGY.md](../04-mobile/01-CROSS_PLATFORM_STRATEGY.md).
- **State management**: keep client state minimal. Filters and the selected
  date range are `useState`/URL search params, not global state. Reserve
  **Zustand** for genuinely cross-component client state (the admin
  impersonation "acting as" banner/context, global filters). Server state is
  **TanStack Query** (Tier 2 only). This pairing carries forward unchanged
  into the Expo app.

### History Timeline UX

- **Tier 1** trends read as small multiples / sparklines (calm, at-a-glance).
  **Tier 2** shows the full longitudinal line chart with the normal range
  drawn as a **shaded band**, so an out-of-range point reads as contextual,
  not as an alarm.
- Selectable time window (3mo / 6mo / 1yr / all).
- Hover tooltip shows the exact value, **that specific report's** range, and
  lab name.
- A visible **"Cross-lab caution"** badge (amber) renders whenever
  `observation_trend.cross_lab_caution = true`. This badge must never be
  silently hidden or suppressed — it may be dismissed per-view but must
  reappear on next load if the underlying flag is still true (Golden Rule
  #7).

### Doctor-Prep Panel

"Questions to ask your doctor" list plus "export doctor-ready PDF" CTA,
available on both tiers: per-report export from Tier 2, and an optional
combined multi-report export from Tier 1 (nice-to-have, not MVP-blocking).

## Super-Admin Dashboard

Full SaaS super-admin scope:

- **User management**: searchable/filterable user list, suspend/reinstate
  toggle.
- **Impersonate-for-support**: time-boxed session token, a persistent
  banner visible to the admin for the duration of the impersonation,
  mandatory reason field before start, every start/stop event written to
  `audit_log`. This is an auth-context switch, not a UI toggle — the admin's
  session must carry a distinct "acting as" claim the API checks on every
  request, not a client-side flag that merely changes what's rendered.
- **Cross-user report visibility**: read-only report viewer for support,
  gated by the same impersonation audit trail — no direct unaudited DB
  access path, ever.
- **Flagged/needs-review queue**: table over `review_queue_item`, filterable
  by reason (`low_confidence` / `validation_error` / `user_flagged` /
  `processing_failed`), assignable to an admin, with a resolve action.
- **System health**: pipeline stage success/failure rates, queue depth
  (via `processing_job` status counts), last N processing errors, and
  free-tier quota indicators as first-class widgets given the project's
  budget constraints — OpenRouter daily request count used, Supabase
  storage % used, Render/worker instance-hours used this month (see
  [07-FREE_TIER_LIMITS.md](../02-architecture/07-FREE_TIER_LIMITS.md)).
- **Audit log viewer**: searchable by actor, action, target, and timestamp
  over `audit_log`.
- **Feature-flag toggles**: UI over the `feature_flag` table, runtime-
  toggleable (no redeploy needed), mirroring the existing `FF_*` env flags
  documented in
  [04-ADAPTER_FACTORY_GUIDE.md](../02-architecture/04-ADAPTER_FACTORY_GUIDE.md).

**Frontend framing**: the admin console is a distinct auth surface (role
check on every route, not just a hidden nav item) and should not share
layout/state assumptions with the patient dashboard beyond common UI
primitives — impersonation in particular needs server-verified session
state on every request, since a client-only "acting as user X" flag would
be a privilege-escalation bug, not a feature.
