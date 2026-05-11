# TKT-044 Source Grounding Validator

- Status: BACKLOG
- Priority: P0
- Epic: EPIC-003
- Sprint: SPRINT-05

## Problem
Generated text must be traceable to extracted report evidence.

## Scope
- Validation middleware for summary claims
- Reject or revise unsupported statements

## Acceptance Criteria
1. Unsupported claims are blocked from final output.
2. Validation report stored with summary snapshot.
3. QA tests include adversarial prompt cases.
