# MedLens+ Documentation

Folders are numbered in reading order. Start at `00-start` and work down; each
folder builds on the ones before it. Files inside each folder are numbered too —
read them in order, or jump to the number that matches your task.

| #   | Folder                                   | What's inside                                                                                                                                                         | Who reads it                                          |
| --- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 00  | [`00-start/`](./00-start/)               | Agent brief, skills baseline, and the rules/skills map — the orientation layer.                                                                                       | Anyone (human or agent) starting on the project.      |
| 01  | [`01-product/`](./01-product/)           | Product vision, PRD, golden safety rules, MVP scope, and the user journeys the product must serve.                                                                    | Everyone — read before touching architecture or code. |
| 02  | [`02-architecture/`](./02-architecture/) | System architecture, stack decisions, data model, adapter/factory pattern, deployment topology, free-tier limits, resilience/observability, and safety/compliance.    | Engineers building or changing the system.            |
| 03  | [`03-ai/`](./03-ai/)                     | Extraction pipeline, RAG and retrieval, the model/provider matrix, and the LangGraph migration plan.                                                                  | Engineers working on AI/parsing/retrieval.            |
| 04  | [`04-mobile/`](./04-mobile/)             | Cross-platform strategy for the mobile surface.                                                                                                                       | Anyone planning or building mobile.                   |
| 05  | [`05-roadmap/`](./05-roadmap/)           | MVP-to-enterprise plan, the one-year roadmap, and the weekend execution plan.                                                                                         | Planning and prioritization.                          |
| 06  | [`06-ops/`](./06-ops/)                   | Runtime, configuration and feature flags, deployment strategy, branch protection, automation PAT, supply-chain security, and maintainer delivery.                     | Operators and maintainers running the project.        |
| 07  | [`07-open-source/`](./07-open-source/)   | Operating manual and conventions; branching, commit, and release strategy; project setup, quality gates, PR/protection policy, and contributor/maintainer checklists. | Contributors and maintainers.                         |
| 08  | [`08-marketing/`](./08-marketing/)       | Copy voice, off-page SEO, and waitlist admin.                                                                                                                         | Anyone on public-facing copy and growth.              |

## Files in reading order

### 00-start

1. [`01-AGENT_BRIEF.md`](./00-start/01-AGENT_BRIEF.md) — Coding Agent Brief
2. [`02-AGENT_SKILLS_BASELINE.md`](./00-start/02-AGENT_SKILLS_BASELINE.md) — Agent Skills Baseline
3. [`03-RULES_AND_SKILLS_MAP.md`](./00-start/03-RULES_AND_SKILLS_MAP.md) — Rules and Skills Map
4. [`04-SKILLS_PROVENANCE.md`](./00-start/04-SKILLS_PROVENANCE.md) — Skills Provenance

### 01-product

1. [`01-PRODUCT_VISION.md`](./01-product/01-PRODUCT_VISION.md) — Product Vision
2. [`02-PRD.md`](./01-product/02-PRD.md) — PRD
3. [`03-GOLDEN_RULES.md`](./01-product/03-GOLDEN_RULES.md) — Golden Rules
4. [`04-MVP_V1_SPEC.md`](./01-product/04-MVP_V1_SPEC.md) — MVP v1 Spec
5. [`05-USER_JOURNEYS.md`](./01-product/05-USER_JOURNEYS.md) — User Journeys
6. [`06-DASHBOARD_SPEC.md`](./01-product/06-DASHBOARD_SPEC.md) — Dashboard Spec

### 02-architecture

1. [`01-SYSTEM_ARCHITECTURE.md`](./02-architecture/01-SYSTEM_ARCHITECTURE.md) — System Architecture
2. [`02-STACK_DECISIONS.md`](./02-architecture/02-STACK_DECISIONS.md) — Stack Decisions
3. [`03-DATA_MODEL.md`](./02-architecture/03-DATA_MODEL.md) — Data Model
4. [`04-ADAPTER_FACTORY_GUIDE.md`](./02-architecture/04-ADAPTER_FACTORY_GUIDE.md) — Adapter and Factory Guide
5. [`05-SHARED_PACKAGES_STRATEGY.md`](./02-architecture/05-SHARED_PACKAGES_STRATEGY.md) — Shared Packages Strategy
6. [`06-DEPLOYMENT_TOPOLOGY.md`](./02-architecture/06-DEPLOYMENT_TOPOLOGY.md) — Deployment Topology
7. [`07-FREE_TIER_LIMITS.md`](./02-architecture/07-FREE_TIER_LIMITS.md) — Free-Tier Limits
8. [`08-RESILIENCE_AND_OBSERVABILITY.md`](./02-architecture/08-RESILIENCE_AND_OBSERVABILITY.md) — Resilience and Observability
9. [`09-SAFETY_AND_COMPLIANCE.md`](./02-architecture/09-SAFETY_AND_COMPLIANCE.md) — Safety and Compliance

### 03-ai

1. [`01-EXTRACTION_PIPELINE.md`](./03-ai/01-EXTRACTION_PIPELINE.md) — Extraction Pipeline
2. [`02-RAG_AND_RETRIEVAL.md`](./03-ai/02-RAG_AND_RETRIEVAL.md) — RAG and Retrieval
3. [`03-MODEL_PROVIDER_MATRIX.md`](./03-ai/03-MODEL_PROVIDER_MATRIX.md) — Model Provider Matrix
4. [`04-LANGGRAPH_MIGRATION.md`](./03-ai/04-LANGGRAPH_MIGRATION.md) — LangGraph Migration

### 04-mobile

1. [`01-CROSS_PLATFORM_STRATEGY.md`](./04-mobile/01-CROSS_PLATFORM_STRATEGY.md) — Cross-Platform Strategy

### 05-roadmap

1. [`01-MVP_TO_ENTERPRISE_PLAN.md`](./05-roadmap/01-MVP_TO_ENTERPRISE_PLAN.md) — MVP to Enterprise Execution Plan
2. [`02-ONE_YEAR_ROADMAP.md`](./05-roadmap/02-ONE_YEAR_ROADMAP.md) — One-Year Roadmap
3. [`03-WEEKEND_EXECUTION_PLAN.md`](./05-roadmap/03-WEEKEND_EXECUTION_PLAN.md) — Weekend Execution Plan

### 06-ops

1. [`01-LOCAL_AND_PROD_RUNTIME.md`](./06-ops/01-LOCAL_AND_PROD_RUNTIME.md) — Local and Production Runtime
2. [`02-CONFIGURATION_AND_FLAGS.md`](./06-ops/02-CONFIGURATION_AND_FLAGS.md) — Configuration and Feature Flags
3. [`03-DEPLOYMENT_STRATEGY.md`](./06-ops/03-DEPLOYMENT_STRATEGY.md) — Deployment Strategy
4. [`04-BRANCH_PROTECTION_SETUP.md`](./06-ops/04-BRANCH_PROTECTION_SETUP.md) — Branch Protection Setup
5. [`05-GITHUB_AUTOMATION_PAT.md`](./06-ops/05-GITHUB_AUTOMATION_PAT.md) — GitHub Automation PAT
6. [`06-SUPPLY_CHAIN_SECURITY.md`](./06-ops/06-SUPPLY_CHAIN_SECURITY.md) — Supply Chain Security
7. [`07-MAINTAINER_DELIVERY.md`](./06-ops/07-MAINTAINER_DELIVERY.md) — Maintainer Delivery Sync

### 07-open-source

1. [`01-PROJECT_OPERATING_MANUAL.md`](./07-open-source/01-PROJECT_OPERATING_MANUAL.md) — Project Operating Manual
2. [`02-CONVENTIONS.md`](./07-open-source/02-CONVENTIONS.md) — Repository Conventions
3. [`03-NAMING_CONVENTIONS.md`](./07-open-source/03-NAMING_CONVENTIONS.md) — Naming Conventions
4. [`04-BRANCHING_STRATEGY.md`](./07-open-source/04-BRANCHING_STRATEGY.md) — Branching Strategy
5. [`05-COMMIT_STRATEGY.md`](./07-open-source/05-COMMIT_STRATEGY.md) — Commit Strategy
6. [`06-GITHUB_PROJECTS.md`](./07-open-source/06-GITHUB_PROJECTS.md) — GitHub Projects Delivery Board
7. [`07-PROJECT_VIEWS_SETUP.md`](./07-open-source/07-PROJECT_VIEWS_SETUP.md) — GitHub Project Views Setup
8. [`08-TOOLING_SETUP.md`](./07-open-source/08-TOOLING_SETUP.md) — Third-Party Tooling Setup
9. [`09-QUALITY_GATES.md`](./07-open-source/09-QUALITY_GATES.md) — Quality Gates
10. [`10-PR_REVIEW_AND_PROTECTION_POLICY.md`](./07-open-source/10-PR_REVIEW_AND_PROTECTION_POLICY.md) — PR Review and Protection Policy
11. [`11-RELEASE_PROCESS.md`](./07-open-source/11-RELEASE_PROCESS.md) — Release Process
12. [`12-CONTRIBUTOR_FLYWHEEL.md`](./07-open-source/12-CONTRIBUTOR_FLYWHEEL.md) — Contributor Flywheel
13. [`13-OSS_MAINTAINER_CHECKLIST.md`](./07-open-source/13-OSS_MAINTAINER_CHECKLIST.md) — OSS Maintainer Checklist
14. [`14-CONTRIBUTING_READY_CHECKLIST.md`](./07-open-source/14-CONTRIBUTING_READY_CHECKLIST.md) — Public OSS Readiness Checklist

### 08-marketing

1. [`01-COPY_VOICE.md`](./08-marketing/01-COPY_VOICE.md) — Marketing Copy Voice
2. [`02-OFF_PAGE_SEO.md`](./08-marketing/02-OFF_PAGE_SEO.md) — Off-Page SEO Checklist
3. [`03-WAITLIST_ADMIN.md`](./08-marketing/03-WAITLIST_ADMIN.md) — Waitlist Admin Guide
