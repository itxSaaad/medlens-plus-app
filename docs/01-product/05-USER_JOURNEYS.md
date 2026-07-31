# User Journeys

Flow-level detail. Product scope lives in [04-MVP_V1_SPEC.md](./04-MVP_V1_SPEC.md) and
[02-PRD.md](./02-PRD.md); this doc maps each journey to screens/states and the
backend that backs it. Pipeline stage names reference
[01-SYSTEM_ARCHITECTURE.md](../02-architecture/01-SYSTEM_ARCHITECTURE.md)'s 5-node
graph; deployment/runtime split references
[06-DEPLOYMENT_TOPOLOGY.md](../02-architecture/06-DEPLOYMENT_TOPOLOGY.md).

## Signup / Onboarding

1. Landing -> sign up (email/password or OAuth via Supabase Auth) -> email verify.
2. Profile setup: date of birth, sex, locale.
3. Empty-state home: "Upload your first report" call to action, no dashboard
   data yet.

Backend: `POST /auth/signup` (delegates to `AuthProvider`), `POST /profile`
inserting `patient_profile`.

## Upload Report

1. Drag-drop or file-picker (PDF/image).
2. Client uploads directly to Supabase Storage (signed URL), API inserts a
   `report_document` row and enqueues processing.
3. UI shows an honest **processing** state, not a spinner implying seconds —
   the worker handling OCR/LLM may be cold-starting (see
   `06-DEPLOYMENT_TOPOLOGY.md`), so copy should say "usually under two minutes"
   and poll/subscribe for status rather than block.
4. Terminal states: **success** (`ready_for_user_review`), **needs review**
   (low confidence or validation error — user still sees extracted data with
   a "some values need confirmation" notice), or **failed** (OCR yielded no
   text, or the pipeline exhausted retries — user can retry upload).

Backend: `POST /reports` -> Storage `put` -> `report_document` insert ->
QStash publish -> worker runs Intake/OCR -> Medical Parser nodes ->
`processing_job.status` updated for the UI to poll/subscribe on.

## View Processed Report (Single Upload Detail)

Detail view for one `report_document`: extracted values table (each row =
one `lab_observation` with its own `reference_range`, unit, and flag),
safety-filtered summary text, and a "view original scan" toggle against the
stored file. This is the **Tier 2** view described in
[06-DASHBOARD_SPEC.md](./06-DASHBOARD_SPEC.md) — reachable from the overview grid
or from the chronological all-uploads list.

Backend: `GET /reports/{id}`, `GET /reports/{id}/observations`.

Frontend: the one interactive surface using **TanStack Query**, via the
server-prefetch + `HydrationBoundary` pattern (prefetch on a per-request
`QueryClient` in the RSC, `dehydrate` into `<HydrationBoundary>`, read with
`useQuery`). Set a non-zero `staleTime` or the prefetch is refetched on mount.
The `queryFn` hits FastAPI through `packages/api-client` — never a Server
Action. Caching here is TanStack Query's per-session client cache only, which
cannot leak across users. See [06-DASHBOARD_SPEC.md](./06-DASHBOARD_SPEC.md) Tier 2.

## Dashboard — Overview Tier

Landing view after the first successful upload: an aggregate health-status
grid, one card per report category (CBC, LFT, KFT/RFT, Lipid, HbA1c,
Thyroid, Vitamin D, Vitamin B12), each showing the most recent flag
(green/yellow/red) and last-tested date, plus a top-level "needs attention"
banner if anything is yellow/red. Answers "how am I doing right now,
overall" — it does not show every historical value. See
`06-DASHBOARD_SPEC.md` Tier 1 for the full spec.

Backend: `GET /dashboard/summary` (latest `lab_observation.flag` per
`biomarker_key`, grouped by report category).

Frontend: pure RSC, fetched server-side against the backend through
`packages/api-client` — no TanStack Query, no client bundle cost. Per-user
PHI, so it is fetched **dynamic/uncached** at the Next.js layer (never
`"use cache"` on a user-scoped fetch); authenticate with `getUser()`, not
`getSession()`, and run the tenant check inside the data-fetching layer. Each
category card gets its own `<Suspense>` boundary so fast cards stream first.
See [06-DASHBOARD_SPEC.md](./06-DASHBOARD_SPEC.md) Tier 1.

## Dashboard — Detail Tier (Per Date / Per Upload)

Distinct journey from the overview: the user drills into either a report
category card or a specific date in the all-uploads list to reach the full
per-upload detail (identical destination as "View Processed Report" above —
this entry names the _dashboard navigation path_ into it, since the user
explicitly expects "overall stats, then per-date/per-upload detail" as two
separate levels, not one flat screen).

Backend: `GET /reports?user_id=&sort=report_date_desc` (all-uploads list),
then `GET /reports/{id}` as above.

## Longitudinal History / Trends

1. Per-biomarker view: date-range selector (3mo / 6mo / 1yr / all).
2. Line chart with hover tooltip showing exact value, that specific report's
   range, and lab name.
3. Historical values table below the chart.
4. Visible **cross-lab caution** badge whenever `observation_trend
.cross_lab_caution = true` — never hidden or dismissible-without-persistence
   (Golden Rule #7).

Backend: `GET /biomarkers/{key}/trend?range=`, backed by `observation_trend`.

## Recommendations / Doctor-Prep

"Questions to ask your doctor" panel per report, plus "export doctor-ready
PDF" CTA (per-report from Tier 2; a combined multi-report PDF from Tier 1 is
a nice-to-have, not MVP-blocking).

Backend: `GET /reports/{id}/doctor-questions`, `POST /reports/{id}/export`.

## Caregiver-Scoped Access

1. Patient invites a caregiver by email; caregiver accepts, creating a
   `caregiver_access_grant` row.
2. Caregiver gets a profile switcher across all patients who've granted
   access.
3. Caregiver views are **read-only** — same Tier 1/Tier 2 dashboard, scoped
   by RLS (`caregiver_access_grant`), no upload/edit affordances shown.

Cache safety: because one browser session can switch between patients via the
profile switcher, this is the sharpest cross-tenant cache-leak risk in the
product. The scoping check runs **inside the data-fetching layer** (not only
in a route guard), user-scoped data stays uncached at the Next.js layer, and
any cache tag must be namespaced by patient id (`labs/${patientId}`), never a
global tag. See [06-DASHBOARD_SPEC.md](./06-DASHBOARD_SPEC.md) cache-safety rules.

Backend: `POST /caregiver/invite`, `GET /caregiver/patients`,
`GET /reports?patient_id=` (RLS-scoped).

## Admin Support / Moderation

Full super-admin console — see `06-DASHBOARD_SPEC.md` for the complete spec:
user search/suspend/impersonate (mandatory reason, audited), flagged/review
queue, system health (including free-tier quota widgets), audit log viewer,
runtime feature-flag toggles.

Backend: `GET /admin/users`, `POST /admin/users/{id}/suspend`,
`POST /admin/users/{id}/impersonate`, `GET /admin/review-queue`,
`GET /admin/health`, `GET /admin/audit-log`, `PATCH /admin/feature-flags/{key}`.

## Future: Ask Your Health History (Phase 2, not MVP-blocking)

Natural-language Q&A over a user's own report history, backed by the hybrid
search + reranking subsystem described in
[../ai/02-RAG_AND_RETRIEVAL.md](../03-ai/02-RAG_AND_RETRIEVAL.md). Not part of the
MVP loop — the Tier 1/Tier 2 dashboards and trend view are the primary
history-consumption surfaces until this ships.
