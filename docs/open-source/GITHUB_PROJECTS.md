# GitHub Projects Delivery Board

MedLens+ uses [GitHub Project #2](https://github.com/users/itxSaaad/projects/2) as the single source of truth for delivery tracking.

## Hierarchy

| Level | GitHub artifact | Label |
|-------|-----------------|-------|
| Epic | Parent issue | `type:epic` |
| Story | Issue (TKT-XXX) | `type:story` |
| Sub-issue | Child of story | `type:sub-task` |
| Sprint | Project **Sprint** iteration field | `sprint:SPRINT-XX` |

## Status Model

| Status | When to use |
|--------|-------------|
| **Backlog** | Scoped but not scheduled for the active sprint |
| **Ready** | Dependencies met; safe for contributors to pick up |
| **In Progress** | Branch open; assignee actively working |
| **Blocked** | Waiting on dependency or decision |
| **In Review** | PR open; awaiting review |
| **Done** | Merged, checks green, docs updated |

## Milestones (Gates)

| Milestone | Phase | Issues |
|-----------|-------|--------|
| Gate A - Foundation | Phase 0 | EPIC-001, TKT-001-013 |
| Gate B - MVP Core Loop | Phase 1 | EPIC-002, TKT-020-034 |
| Gate C - Public Beta | Phase 3 | EPIC-003/004, TKT-040-053 |
| Phase 4/5 | Enterprise | Placeholder |

## Project Views

| View | Layout | Purpose |
|------|--------|---------|
| **Delivery Board** | Board | Group by Status; sort Priority |
| **Current Sprint** | Board | Sprint = SPRINT-02, not Done |
| **Epic Roadmap** | Roadmap | Group by Epic |
| **Phase Table** | Table | Ticket ID, Status, Epic, Priority, Sprint |
| **Contributor Queue** | Table | Ready or good first issue |
GitHub does not expose a public API to create views. Follow [`PROJECT_VIEWS_SETUP.md`](./PROJECT_VIEWS_SETUP.md) (step-by-step GUI guide).

## Maintainer sync (not for contributors)

See `docs/ops/MAINTAINER_DELIVERY.md` — run `.github/maintainer/sync-delivery.py --all` only when board fields need repair.

1. Open the [MedLens+ Project Board](https://github.com/users/itxSaaad/projects/2)
2. Use **Contributor Queue** or **Current Sprint**
3. Filter **Status = Ready**
4. Comment on the issue: "I'll take this"
5. Branch from `main`

**Current critical path:** `TKT-013` Environment Strategy and Config — unblocks Sprint 03 ingestion.

## Branch Naming

```
feat/TKT-013-env-strategy-config
fix/TKT-XXX-short-slug
```

## PR Requirements

- Title: conventional commit format
- Body: `Closes #NNN`
- Target: `develop` (features); promotion PRs to `staging`/`main` by maintainers
- Merge: **squash only** on protected branches
