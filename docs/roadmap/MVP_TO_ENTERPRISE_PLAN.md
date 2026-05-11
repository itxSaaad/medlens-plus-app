# MedLens+ MVP to Enterprise Execution Plan

## 1) Planning Horizon and Constraints

- Builder capacity: 2-3 hours per weekend (solo-first, contributor-assisted)
- MVP target: 24 weeks
- Public beta target: 32-36 weeks
- Enterprise-ready platform target: 12-18 months

## 2) Stage Gates (What must be true before moving forward)

1. Gate A (Foundation): repo/process/safety baseline ready
2. Gate B (MVP): end-to-end report intelligence works on supported panels
3. Gate C (Beta): reliability + UX + contributor throughput stable
4. Gate D (Enterprise Foundation): multi-tenant security/compliance baseline live
5. Gate E (Scale): partner/API ecosystem + resilient operations

## 3) Phase-by-Phase Execution

## Phase 0: Foundation (Weeks 1-4)

### Outcomes

- Contributors can join and deliver with minimal handholding.
- Product scope and clinical safety boundaries are explicit.

### Build Scope

- Governance docs, branching model, issue/PR templates
- Architecture, PRD, safety policy, data model v1
- Initial CI for docs/structure checks

### KPIs

- Contributor setup time < 30 minutes
- PR template adoption = 100%

### Exit Criteria (Gate A)

- Planning hierarchy active (`epics`, `sprints`, `tickets`)
- Safety policy merged and referenced by PR template

## Phase 1: MVP Core Loop (Weeks 5-12)

### Outcomes

Ship first meaningful loop:
`upload -> extract -> normalize -> compare -> summary`

### Build Scope

- Upload + object storage abstraction
- Async ingestion worker
- OCR/table extraction pipeline
- Support first report set: CBC, Lipid, HbA1c
- Timeline v1 and doctor-ready summary v1

### Engineering Targets

- p95 end-to-end processing <= 120 seconds/report
- Every observation includes confidence and source anchor

### KPI Targets

- 25+ real-world reports processed in test dataset
- >= 85% structured extraction accuracy on supported panels

### Exit Criteria (Gate B)

- MVP demoable to external users
- Summary includes disclaimer + source grounding on every run

## Phase 2: MVP Hardening (Weeks 13-20)

### Outcomes

Stabilize for early real users.

### Build Scope

- Trend engine: rising/falling/stable + percentage delta
- Missing-information detector
- Doctor-visit question generator based on history
- Error taxonomy, retry strategy, DLQ path
- Observability (OpenTelemetry traces + Sentry)

### Quality/Safety Targets

- Pipeline completion rate >= 95% (supported report types)
- Unsafe language incidents in QA sample: 0

### Exit Criteria

- Can run weekly bug triage + reliability sprint without architecture rewrites
- Benchmark harness available for regression checks

## Phase 3: Public Beta + OSS Growth (Weeks 21-36)

### Outcomes

Build trust, usage, and contributor momentum.

### Build Scope

- Multi-report timeline UX polish
- Exportable doctor brief PDF
- Family/caregiver sharing (view permissions)
- Public changelog and demo release cadence
- Good-first-issue lane + onboarding docs refinement

### Product KPI Targets

- 100+ waitlist/signups
- WAU growth trend positive for 8 weeks

### Community KPI Targets

- 5-10 external contributors
- Median PR review turnaround < 72 hours

### Exit Criteria (Gate C)

- Beta users can independently complete full workflow
- Contributors close tickets without synchronous maintainer pairing

## Phase 4: Enterprise Foundation (Months 9-12)

### Outcomes

Transform single-product app into enterprise-capable platform.

### Platform Scope

- Tenant-aware data model and tenant-scoped authorization
- RBAC: owner/admin/clinician/caregiver roles
- Audit logs for data access + generated output events
- Safety policy engine (rule-based + model checks)
- Provider abstraction and model failover strategy

### Infra Scope (Terraform-first)

- Queue migration: Upstash -> SQS + DLQ
- Storage migration: R2 -> S3 (S3 interface compatibility)
- Compute split: API + workers (ECS Fargate)
- Environments: dev/staging/prod with isolated state

### Operational KPI Targets

- SLO dashboard live
- MTTR < 2 hours for P1 incidents

### Exit Criteria (Gate D)

- Infra fully reproducible from Terraform
- Tenant isolation tests and access-control tests passing

## Phase 5: Enterprise Scale (Months 12-18)

### Outcomes

Support organizational customers and integrations.

### Product Scope

- API-first partner ingestion
- Clinic workspace and cohort dashboards
- Human-in-the-loop review flows for uncertain extractions
- Contract-grade exports and organization reporting

### Reliability Targets

- API availability target: 99.9%
- RPO < 15 minutes, RTO < 1 hour
- Queue backlog autoscaling and provider outage fallback tested

### Exit Criteria (Gate E)

- First pilot org successfully onboarded
- Security/compliance checklist versioned and auditable

## 4) Architecture Evolution Map

1. MVP: Vercel + FastAPI + Supabase + R2 + Upstash
2. Growth: worker separation, stronger observability, eval harness
3. Enterprise foundation: SQS/S3/ECS + tenant security model
4. Scale: API ecosystem + policy engine + cost governance

## 5) Weekend Execution System (Exact cadence)

- Week 1 of each month: feature ticket
- Week 2: reliability/refactor ticket
- Week 3: test + docs ticket
- Week 4: release note + backlog grooming + contributor issue prep

If only 2 weekends are available in a month:

1. weekend A: highest-value feature
2. weekend B: tests + docs + release polish

## 6) Priority Queue (Next 12 Tickets)

1. TKT-010 upload API
2. TKT-011 storage adapter
3. TKT-012 ingestion worker skeleton
4. TKT-020 parser integration
5. TKT-021 biomarker normalization
6. TKT-030 trend analysis
7. TKT-031 doctor summary generation
8. TKT-040 confidence scoring hardening
9. TKT-041 source-grounding validator
10. TKT-042 safety policy engine v1
11. TKT-043 timeline UX v2
12. TKT-044 evaluation harness CLI

## 7) Future Opportunities (Product and Business)

1. Consumer subscription: family timeline + reminder intelligence
2. Clinic product: consultation prep automation and progress monitoring
3. Insurer workflows: standardized risk timeline exports
4. Regional language intelligence: Urdu/Arabic/English report interpretation
5. SDK/API platform: embed MedLens+ longitudinal engine into third-party apps

## 8) Monetization Progression

1. Stage 0: free/open-source credibility and community
2. Stage 1: freemium (limited history, limited exports)
3. Stage 2: pro plan (advanced trends, caregiver packs, premium summaries)
4. Stage 3: B2B seats + usage-based API plan

## 9) Top Risks and Controls

1. Report format variability
   Control: benchmark corpus, confidence scoring, manual override workflow.
2. Medical safety risk
   Control: strict non-diagnosis rules, safety filters, clinician review loop.
3. Solo-builder throughput bottleneck
   Control: contributor flywheel, good-first-issue pipeline, docs-first planning.
4. Vendor lock-in
   Control: storage/queue/model adapters + Terraform portability.

## 10) Leadership Dashboard (Monthly)

- Product: WAU, report completion rate, retention
- Engineering: lead time, deployment frequency, failure rate
- AI Quality: extraction precision/recall, unsafe output incidents
- Community: active contributors, median PR cycle time
- Business: waitlist growth, conversion to active users
