# TKT-011 API Service Baseline

- Status: DONE
- Priority: P0
- Epic: EPIC-001
- Sprint: SPRINT-02

## Problem
Need a stable API baseline with typed validation and testability.

## Scope
- FastAPI app scaffold
- Health endpoint
- Python lint/type/test setup

## Acceptance Criteria
1. `/health` returns `200` with status payload.
2. `ruff`, `mypy`, `pytest` run in CI.
3. API README includes local setup.
