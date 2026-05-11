# TKT-042 Summary Composer

- Status: BACKLOG
- Priority: P0
- Epic: EPIC-003
- Sprint: SPRINT-05

## Problem
Users need plain-language, source-grounded summaries for doctor visits.

## Scope
- Patient summary section
- Doctor brief section
- Missing information and follow-up questions section

## Acceptance Criteria
1. Output sections follow stable schema.
2. Every claim includes source reference.
3. Summary never includes diagnosis/prescription language.
4. Snapshot persisted with model/prompt version metadata.

## Dependencies
TKT-040, TKT-041
