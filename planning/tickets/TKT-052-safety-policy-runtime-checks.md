# TKT-052 Safety Policy Runtime Checks

- Status: BACKLOG
- Priority: P0
- Epic: EPIC-004
- Sprint: SPRINT-06

## Problem
Medical safety guardrails must be enforced at runtime, not only in prompt text.

## Scope
- Runtime policy checks before response finalization
- Blocking/rewrite behavior for unsafe content

## Acceptance Criteria
1. Unsafe categories are explicitly enumerated.
2. Policy violations are logged and metrified.
3. Integration tests validate blocked unsafe outputs.
