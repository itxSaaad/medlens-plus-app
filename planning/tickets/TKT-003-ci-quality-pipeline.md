# TKT-003 CI Quality Pipeline

- Status: DONE
- Priority: P0
- Epic: EPIC-001
- Sprint: SPRINT-01

## Problem
A production-grade repo must enforce lint/typecheck/test/build automatically.

## Scope
- GitHub Actions CI for JS and Python quality checks
- PR and push triggers for `main`, `staging`, `develop`

## Acceptance Criteria
1. CI runs lint/typecheck/test/build for JS workspace.
2. CI runs ruff/mypy/pytest for API service.
3. Failing checks block merge.

## Dependencies
TKT-002
