# Planning System

This folder is the execution source of truth for MedLens+ delivery.

## Structure
- `epics/`: strategic outcomes
- `sprints/`: time-boxed execution plans
- `tickets/`: implementation tasks with acceptance criteria

## Status Model
- `BACKLOG`
- `READY`
- `IN_PROGRESS`
- `BLOCKED`
- `IN_REVIEW`
- `DONE`

## Priority Levels
- `P0`: critical path
- `P1`: high
- `P2`: medium
- `P3`: low

## Delivery Rule
No sprint is considered complete unless:
- all `P0` and `P1` tickets are done,
- checks are green,
- docs are updated,
- release notes are prepared.
