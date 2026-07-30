# Maintainer Delivery Sync

For repository maintainers only. Contributors work from the GitHub Project board.

## When to run

- After changing `planning/sprints/` or epic structure
- After adding canonical issues on GitHub
- When project fields (Status, Epic, Sprint) look empty on the board

## Workflow

```powershell
python .github/maintainer/build-manifest.py   # optional: refresh sprint lists
python .github/maintainer/sync-delivery.py --all
```

## Branch alignment

Trunk-based — delivery changes merge directly to `main` via PR (squash), same as any other change. No separate promotion step. See [`docs/07-open-source/04-BRANCHING_STRATEGY.md`](../07-open-source/04-BRANCHING_STRATEGY.md).

## Project views

GitHub has no API to create views. Follow [`docs/07-open-source/07-PROJECT_VIEWS_SETUP.md`](../07-open-source/07-PROJECT_VIEWS_SETUP.md).

## Branch protection (one-time)

See [`04-BRANCH_PROTECTION_SETUP.md`](04-BRANCH_PROTECTION_SETUP.md).
