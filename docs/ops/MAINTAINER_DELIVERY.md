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

## Branch alignment (one-time)

After merging delivery changes to `develop`:

1. Open PR `develop` → `staging`, review, merge manually
2. Open PR `staging` → `main`, review, merge manually
3. Merge any backmerge PRs (`main` → `staging`, `main` → `develop`) opened by the backmerge workflow

See [`docs/open-source/BRANCHING_STRATEGY.md`](../open-source/BRANCHING_STRATEGY.md).

## Project views

GitHub has no API to create views. Follow [`docs/open-source/PROJECT_VIEWS_SETUP.md`](../open-source/PROJECT_VIEWS_SETUP.md).

## Branch protection (one-time)

See [`BRANCH_PROTECTION_SETUP.md`](BRANCH_PROTECTION_SETUP.md).
