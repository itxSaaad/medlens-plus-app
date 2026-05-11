# TKT-023 Ingestion Worker Bootstrap

- Status: BACKLOG
- Priority: P0
- Epic: EPIC-002
- Sprint: SPRINT-03

## Problem
Background extraction work must not block user-facing API requests.

## Scope
- Worker process entrypoint
- Queue consumer loop
- Job state transitions

## Acceptance Criteria
1. Worker consumes queue events and updates status transitions.
2. Failures are captured with retry counters.
3. Logs include `job_id`, `report_id`, `tenant_id` (future-ready).
