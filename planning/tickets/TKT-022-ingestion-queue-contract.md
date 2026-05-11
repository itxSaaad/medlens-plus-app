# TKT-022 Ingestion Queue Contract

- Status: BACKLOG
- Priority: P0
- Epic: EPIC-002
- Sprint: SPRINT-03

## Problem
Asynchronous processing requires stable event contracts for retries and observability.

## Scope
- Define queue message schema
- Add idempotency key strategy

## Acceptance Criteria
1. Queue payload schema versioned.
2. Idempotency key included per report job.
3. Contract tests for serialization and validation.

## Dependencies
TKT-012
