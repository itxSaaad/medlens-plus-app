# Data Model (v1)

Concrete Postgres/Supabase schema. This doc is the source-of-truth spec — actual
tables are created via **SQLAlchemy 2.0 async models + Alembic migrations**
(`apps/api/alembic/versions/`). Alembic owns applying this DDL; this document is
not itself a migration. Seed data belongs in Alembic data migrations (versioned,
reversible `upgrade()`/`downgrade()` inserts), not a bespoke seed script.

## Identity and Access

```sql
create type user_role as enum ('patient', 'caregiver', 'admin', 'super_admin');

create table app_user (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  role user_role not null default 'patient',
  display_name text,
  is_suspended boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table patient_profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_user(id) on delete cascade,
  date_of_birth date,
  sex text,
  locale text not null default 'en',
  created_at timestamptz not null default now()
);

-- Explicit consent record, not an implicit share.
-- Delegated access is checked LIVE at query time against this row (see RLS
-- below), never baked into a JWT claim — so revocation and expiry take effect
-- instantly, with no token-refresh wait.
create table caregiver_access_grant (
  id uuid primary key default gen_random_uuid(),
  caregiver_user_id uuid not null references app_user(id) on delete cascade,
  patient_user_id uuid not null references app_user(id) on delete cascade,
  scope text[] not null default array['read_only'],  -- report types/categories the caregiver may read
  granted_at timestamptz not null default now(),
  expires_at timestamptz,                             -- null = no expiry; enforced live in RLS
  revoked_at timestamptz,
  granted_by uuid not null references app_user(id),   -- audit: who created this grant (patient or admin)
  unique (caregiver_user_id, patient_user_id)
);
create index idx_caregiver_grant_lookup
  on caregiver_access_grant(caregiver_user_id, patient_user_id)
  where revoked_at is null;
```

> **Delegation is a table, not a role or a claim.** Caregiver access is never
> a role-wide capability and never a patient id embedded in the caregiver's
> JWT. It is a per-`(caregiver, patient)` grant row, checked live at query
> time. Caregivers get a **read-only** policy only (a `select` policy; no
> `insert`/`update`/`delete` policy exists for the caregiver path). Every
> grant creation and revocation is itself an audited event (see
> [Processing, Admin, Audit](#processing-admin-audit)).

## Canonical Test Mapping (LOINC)

Every observation is stored **twice-described**: the raw extracted values
exactly as the vendor printed them (`biomarker_label_raw`, `value_*`, `unit`,
`source_report_reference_range`) _and_ a resolved canonical identity. The
canonical identifier is a **LOINC code**. LOINC is free for commercial use in
perpetuity (Regenstrief license, no royalties, attribution required), so cost
is not a factor in this choice.

```sql
-- Controlled vocabulary: one curated default LOINC code per supported analyte.
create table canonical_test (
  loinc_code text primary key,           -- e.g. '1742-6'
  canonical_name text not null,          -- e.g. 'ALT'
  unit text not null,                    -- canonical reporting unit, e.g. 'U/L'
  category text not null                 -- panel grouping, e.g. 'LFT' | 'CBC' | 'KFT'
);

-- Hand-curated alias table. The normalization step resolves raw labels here.
create table test_synonym (
  raw_label text primary key,            -- 'SGPT', 'ALT', 'Alanine Aminotransferase'
  loinc_code text not null references canonical_test(loinc_code)
);
```

**Resolution is deterministic, curated, and never a runtime guess.** The parser
_always_ writes the raw observation. A separate normalization step resolves
`biomarker_label_raw` → `loinc_code` through `test_synonym`. A label with no
synonym match leaves `lab_observation.loinc_code` NULL and surfaces for manual
curation — the system **never silently invents a canonical mapping on medical
data**, which would be a safety violation (this is the same discipline as
[03-GOLDEN_RULES.md](../01-product/03-GOLDEN_RULES.md) #6: never substitute an
external mapping for what the report actually says).

Scope is deliberately narrow: **one default LOINC code per analyte** for the
supported panels (LFT, CBC, KFT, etc.). This sidesteps LOINC's method/
specimen/units explosion — ALT alone has several LOINC codes distinguishing
assay method — which is unnecessary precision for trend tracking at this
product's scope. Widen only when a real clinical need appears.

Cross-vendor trend analysis joins on `loinc_code`, so `SGPT` from Vendor A and
`ALT` from Vendor B collapse onto one trend line. The join still carries the
cross-lab caution (below), because same LOINC code across labs does **not**
mean comparable reference ranges (Golden Rule #7).

## Reports and Observations

```sql
create table report_document (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_user(id) on delete cascade,
  file_path text not null,               -- Supabase Storage object path
  original_filename text,
  lab_name text,
  lab_identifier text,                   -- canonical lab id if resolvable
  report_type text,                      -- CBC | LFT | KFT | LIPID | HBA1C | THYROID | VIT_D | VIT_B12 | unknown
  report_date date,                      -- date printed on the report, not upload date
  ocr_provider text,
  ocr_text_raw text,                     -- see storage note below
  parser_version text not null,
  model_version text,
  review_status text not null default 'pending_review',
  uploaded_at timestamptz not null default now(),
  processed_at timestamptz
);
create index idx_report_document_user on report_document(user_id, report_date desc);
```

> **Storage note**: `ocr_text_raw` is TOAST-compressed by Postgres but still
> counts against Supabase's 500MB free DB cap (see
> [07-FREE_TIER_LIMITS.md](./07-FREE_TIER_LIMITS.md)). If per-report OCR text
> volume becomes a real constraint, move it to Supabase Storage as a
> sidecar `.txt` object referenced by path instead of a DB column — do this
> preemptively once the DB is a meaningful fraction of the cap, not after
> hitting it.

```sql
create table reference_range (
  id uuid primary key default gen_random_uuid(),
  report_document_id uuid not null references report_document(id) on delete cascade,
  biomarker_key text not null,
  low numeric,
  high numeric,
  operator text,                         -- '<' | '>' | 'between' | 'qualitative'
  qualitative_value text,                -- e.g. 'Negative' / 'Non-reactive'
  unit text,
  raw_text text not null                 -- exact string as printed, audit trail
);
```

```sql
create table lab_observation (
  id uuid primary key default gen_random_uuid(),
  report_document_id uuid not null references report_document(id) on delete cascade,
  user_id uuid not null references app_user(id) on delete cascade,   -- denormalized for RLS + query speed
  biomarker_key text not null,
  biomarker_label_raw text not null,     -- verbatim vendor label as printed, pre-normalization
  loinc_code text references canonical_test(loinc_code),  -- NULLABLE: canonical id, null until resolved
  value_numeric numeric,
  value_text text,                       -- qualitative results
  unit text,
  reference_range_id uuid references reference_range(id),
  source_report_reference_range text not null,
  source_lab_identifier text not null,
  flag text not null default 'green',    -- 'green' | 'yellow' | 'red'
  confidence_score numeric not null,
  extraction_source text not null,       -- 'fuzzy_match' | 'llm' | 'manual_correction'
  source_snippet text,                   -- OCR excerpt, traceability
  reviewed_by uuid references app_user(id),
  created_at timestamptz not null default now()
);
create index idx_lab_observation_user_biomarker
  on lab_observation(user_id, biomarker_key, created_at desc);
create index idx_lab_observation_user_loinc
  on lab_observation(user_id, loinc_code, created_at desc)
  where loinc_code is not null;         -- trend joins collapse cross-vendor synonyms on loinc_code
```

> **Non-negotiable** (per [03-GOLDEN_RULES.md](../01-product/03-GOLDEN_RULES.md)):
> `source_report_reference_range` and `source_lab_identifier` are `not null`
> on every observation. No code path may compute a `flag` against any range
> other than the one printed on that specific report.

```sql
create table observation_trend (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_user(id) on delete cascade,
  biomarker_key text not null,
  from_observation_id uuid not null references lab_observation(id),
  to_observation_id uuid not null references lab_observation(id),
  delta_absolute numeric,
  delta_percent numeric,
  direction text,                        -- 'increased' | 'decreased' | 'stable'
  cross_lab_caution boolean not null default false,
  computed_at timestamptz not null default now()
);
```

`cross_lab_caution` is set whenever `from_observation` and `to_observation`
have different `source_lab_identifier` — this is what drives the mandatory
UI badge (Golden Rule #7).

```sql
create table summary_snapshot (
  id uuid primary key default gen_random_uuid(),
  report_document_id uuid not null references report_document(id) on delete cascade,
  summary_text text not null,
  safety_filter_passed boolean not null,
  llm_provider text not null,
  llm_model text not null,
  prompt_version text not null,
  created_at timestamptz not null default now()
);

create table doctor_question_set (
  id uuid primary key default gen_random_uuid(),
  report_document_id uuid not null references report_document(id) on delete cascade,
  questions jsonb not null,
  created_at timestamptz not null default now()
);
```

## Retrieval (Phase 2 — cross-report Q&A only)

Not used by per-report extraction. See
[../ai/02-RAG_AND_RETRIEVAL.md](../03-ai/02-RAG_AND_RETRIEVAL.md) and
[../ai/01-EXTRACTION_PIPELINE.md](../03-ai/01-EXTRACTION_PIPELINE.md) for the explicit
boundary between the two.

```sql
create extension if not exists vector;

create table report_summary_embedding (
  id uuid primary key default gen_random_uuid(),
  report_document_id uuid not null references report_document(id) on delete cascade,
  user_id uuid not null references app_user(id) on delete cascade,
  embedding vector(512),                 -- Jina Embeddings v3, Matryoshka-truncated to 512 dims
  embedding_model text not null,
  created_at timestamptz not null default now()
);
create index idx_report_summary_embedding_hnsw on report_summary_embedding
  using hnsw (embedding vector_cosine_ops);

-- BM25-equivalent full-text search, paired with the embedding above for hybrid search
alter table report_document add column report_summary_fts tsvector
  generated always as (to_tsvector('english', coalesce(lab_name, '') || ' ' || coalesce(report_type, ''))) stored;
create index idx_report_document_fts on report_document using gin (report_summary_fts);
```

## Processing, Admin, Audit

```sql
-- Status/audit only — Upstash QStash is the actual queue/retry mechanism.
-- This table lets the API/dashboard read current job state without polling QStash.
create table processing_job (
  id uuid primary key default gen_random_uuid(),
  report_document_id uuid not null references report_document(id) on delete cascade,
  status text not null default 'queued', -- 'queued' | 'processing' | 'succeeded' | 'failed'
  attempt_count int not null default 0,
  last_error text,
  qstash_message_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Append-only. Written by BOTH row-change triggers (see below) and the
-- application for admin/impersonation events. NO update/delete grant exists
-- to any application role — immutability is enforced at the Postgres GRANT
-- level, not by convention.
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references app_user(id),   -- the human actor (from app-injected context on service-role paths)
  subject_user_id uuid references app_user(id), -- the patient whose data was touched
  impersonated_patient_id uuid references app_user(id), -- set only on admin-impersonation reads
  action text not null,                  -- 'insert' | 'update' | 'delete' | 'impersonate_start' | 'suspend_user' | 'grant_caregiver' | 'revoke_caregiver' | 'feature_flag_toggle'
  source_path text not null,             -- 'patient' | 'caregiver' | 'admin_impersonation' | 'trigger'
  resource_type text,                    -- table/entity name, e.g. 'lab_observation'
  resource_id text,
  db_role text,                          -- Postgres role that executed the statement
  old_row jsonb,                         -- populated by row-change triggers on update/delete
  new_row jsonb,                         -- populated by row-change triggers on insert/update
  outcome text not null default 'success', -- 'success' | 'denied' | 'error'
  created_at timestamptz not null default now()
);
create index idx_audit_log_subject on audit_log(subject_user_id, created_at desc);
create index idx_audit_log_actor on audit_log(actor_user_id, created_at desc);

create table feature_flag (
  key text primary key,
  enabled boolean not null default false,
  description text,
  updated_by uuid references app_user(id),
  updated_at timestamptz not null default now()
);

create table review_queue_item (
  id uuid primary key default gen_random_uuid(),
  report_document_id uuid not null references report_document(id) on delete cascade,
  reason text not null,                  -- 'low_confidence' | 'validation_error' | 'user_flagged' | 'processing_failed'
  status text not null default 'open',   -- 'open' | 'in_progress' | 'resolved'
  assigned_admin_id uuid references app_user(id),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);
```

### Audit mechanism (hybrid: triggers + application actor context)

Two mechanisms feed `audit_log`; neither alone is sufficient.

**1. Row-change triggers** on the sensitive tables (`report_document`,
`lab_observation`, `caregiver_access_grant`) capture _every_ row change —
insert/update/delete — regardless of code path (patient API, batch job, admin
script, migration). The trigger writes `old_row`/`new_row`, the operation, the
timestamp, and the executing `db_role`. This is the safety net: even a code
path that forgets to log leaves a trail.

```sql
create function audit_row_change() returns trigger
  language plpgsql security definer set search_path = public as $$
  begin
    insert into audit_log (
      actor_user_id, subject_user_id, impersonated_patient_id,
      action, source_path, resource_type, resource_id, db_role,
      old_row, new_row
    ) values (
      nullif(current_setting('app.actor_user_id', true), '')::uuid,
      coalesce(new.user_id, old.user_id),
      nullif(current_setting('app.impersonated_patient_id', true), '')::uuid,
      lower(tg_op),
      coalesce(nullif(current_setting('app.source_path', true), ''), 'trigger'),
      tg_table_name,
      coalesce(new.id, old.id)::text,
      current_user,
      case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) end,
      case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) end
    );
    return coalesce(new, old);
  end $$;
```

**2. Application-injected actor context.** Triggers cannot see _which human_
acted on a service-role or impersonation call — the DB role is just
`service_role`. So before any admin/impersonation query, the application sets
transaction-local variables that the trigger reads back via
`current_setting(..., true)`:

```sql
-- inside the admin/impersonation transaction, before touching patient data:
select set_config('app.actor_user_id', :admin_user_id, true);           -- true = tx-local
select set_config('app.impersonated_patient_id', :target_patient_id, true);
select set_config('app.source_path', 'admin_impersonation', true);
```

This is the mechanism that records _"admin X read patient Y's report while
impersonating"_ — the fact the trigger-only path cannot express.

**Immutability.** `audit_log` is granted `INSERT` only; no application role
holds `UPDATE`/`DELETE`. Append-only is enforced at the Postgres GRANT level.

> **Later hardening (not MVP):** add a per-row hash chain — each row stores a
> checksum over the prior row's checksum + its own payload — for tamper
> evidence. Full WORM storage (S3 Object Lock), `pgAudit`, and a HIPAA-BAA
> plan tier are enterprise-tier and explicitly out of scope for the free-tier
> portfolio MVP (see [07-FREE_TIER_LIMITS.md](./07-FREE_TIER_LIMITS.md)).

## Row-Level Security

RLS is the **primary tenancy boundary** — the correct and sufficient
mechanism for isolating patient data in Supabase Postgres. It is enabled on
every clinical table. The rules below are mandatory hardening, not style
preferences: each addresses a documented Supabase RLS pitfall (performance
cliff or a real authorization hole), and every policy must follow all of them.

### Mandatory policy rules

1. **Wrap `auth.uid()` in a subquery.** Write `(select auth.uid())`, never
   bare `auth.uid()`. The subquery form forces Postgres to evaluate the value
   **once per statement** as an `initPlan` and cache it, instead of
   re-evaluating per row. This is a documented order-of-magnitude difference
   at scale (≈179ms → ≈9ms). The same applies to the `current_app_user_id()`
   helper — reference it as `(select current_app_user_id())`.
2. **Index every column a policy references.** A btree on `user_id` (and on
   the `caregiver_access_grant` lookup columns) is required — documented
   > 100× speedup on large tables, because the policy predicate becomes a
   > sargable index lookup instead of a sequential scan.
3. **Scope every policy `TO authenticated`.** An anonymous request then
   short-circuits without evaluating the policy body at all.
4. **Route cross-table checks through `SECURITY DEFINER` functions.** An
   in-policy join (e.g. a subquery into `caregiver_access_grant`) re-triggers
   RLS _on the joined table_, which both slows the query dramatically and can
   silently drop rows. A `SECURITY DEFINER` helper runs as its owner and
   evaluates the grant check once, cleanly (documented case: ≈11,000ms → ≈7ms).

```sql
create function current_app_user_id() returns uuid
  language sql stable
  set search_path = public as $$
    select id from app_user where auth_user_id = (select auth.uid())
  $$;

-- Cross-table caregiver-grant check, isolated in a SECURITY DEFINER function so
-- the caregiver_access_grant lookup does NOT re-trigger RLS inside the policy.
-- Checks the grant LIVE: not revoked, not expired — so revocation is instant.
create function caregiver_can_read(target_patient_id uuid) returns boolean
  language sql stable security definer
  set search_path = public as $$
    select exists (
      select 1 from caregiver_access_grant g
      where g.caregiver_user_id = (select current_app_user_id())
        and g.patient_user_id = target_patient_id
        and g.revoked_at is null
        and (g.expires_at is null or g.expires_at > now())
    )
  $$;

alter table report_document enable row level security;

create policy report_document_owner_rw on report_document
  for all to authenticated
  using ((select current_app_user_id()) = user_id);

create policy report_document_caregiver_ro on report_document
  for select to authenticated
  using (caregiver_can_read(report_document.user_id));

alter table lab_observation enable row level security;

create policy lab_observation_owner_rw on lab_observation
  for all to authenticated
  using ((select current_app_user_id()) = user_id);

create policy lab_observation_caregiver_ro on lab_observation
  for select to authenticated
  using (caregiver_can_read(lab_observation.user_id));
```

The same owner-RW + caregiver-RO pattern repeats for `reference_range`,
`observation_trend`, `summary_snapshot`, `doctor_question_set`, and
`report_summary_embedding` (join through `report_document_id`/`user_id`, still
via `caregiver_can_read`, never an inline join). The caregiver path is
**`select`-only** on every table — no caregiver `insert`/`update`/`delete`
policy exists anywhere.

### Column-level writes: RLS does not protect columns

RLS gates _rows_, not _columns_. A broad `for all`/`update` policy that passes
the row check lets the client write **any column on that row** — including
`app_user.role` or `caregiver_access_grant.patient_user_id`, which a client
must never self-assign. Row policies alone cannot stop this. The fix is at the
GRANT level: **REVOKE table-wide write, GRANT only the specific columns** a
client may set.

```sql
-- A patient may update profile-ish fields on their own row, never `role`.
revoke update on app_user from authenticated;
grant  update (display_name, email) on app_user to authenticated;
-- `role`, `is_suspended` are set only by admin service-role paths.

-- caregiver_access_grant: patient sets scope/expiry on grants they create,
-- but patient_user_id / caregiver_user_id / granted_by are never client-writable.
revoke update on caregiver_access_grant from authenticated;
grant  update (scope, expires_at, revoked_at) on caregiver_access_grant to authenticated;
```

### Never trust user-editable claims

Authorization decisions **never** read `raw_user_meta_data` or any other
user-editable JWT claim — a user can edit those. Role and grant checks read a
**database table** (`app_user.role`, `caregiver_access_grant`), or, if a claim
is genuinely needed in the token, one set by a **Custom Access Token Auth
Hook** the server controls (free on Supabase — see
[07-FREE_TIER_LIMITS.md](./07-FREE_TIER_LIMITS.md)), never a self-service field.

### Other documented pitfalls

- **Joins evaluate each table's RLS independently.** A query joining two RLS
  tables applies each table's policy separately, which can produce
  surprising empty results (a row the user _can_ see joined to one they
  cannot). Push cross-table authorization into `SECURITY DEFINER` helpers.
- **Policies on views run as the view owner.** Prefer RLS on _base tables_;
  do not rely on a view as a security boundary.

### Admin / super-admin: separate client, never a weakened policy

Admin access is **not** an RLS policy and there is **no `or is_admin()` clause
anywhere in a patient-data policy** — such a clause would let a compromised or
forged patient session read cross-tenant data if the role check had any bug.
The two paths are physically separate clients (see
[04-ADAPTER_FACTORY_GUIDE.md](./04-ADAPTER_FACTORY_GUIDE.md#tenancyrbac-adapter-surface-db-provider)):

- **Regular path** — a request-scoped Supabase client initialized with the
  caller's JWT, fully RLS-enforced. All patient and caregiver traffic.
- **Admin path** — a separate service-role client that bypasses RLS at the
  Postgres level _by design_, instantiated **only inside admin-gated FastAPI
  handlers**, and only _after_ the app layer independently verifies
  `admin`/`super_admin` against `app_user.role` in the database (not the JWT
  claim alone). The service-role key is a server-side env secret, never
  shipped to `apps/web`, rotated quarterly.

**Impersonation ("acting as a patient")** is an explicit admin endpoint that
(a) verifies admin role, (b) writes the `audit_log` row **before** returning
any data, (c) sets the `app.actor_user_id` / `app.impersonated_patient_id`
transaction-local context (above), and (d) fetches via the service-role client
**scoped to the target `patient_user_id` in the query itself**. Do **not**
implement impersonation by minting a patient JWT for the admin — that erases
the actor identity the audit trail exists to prove.

## Key Design Notes

- Keep original extracted snippets for traceability (`source_snippet`, `raw_text`).
- Store both raw and normalized values (`value_numeric`/`value_text` alongside `biomarker_label_raw`).
- Track `parser_version` and `model_version` per report for reproducibility.
- Every extracted observation carries `confidence_score` and `extraction_source`.
