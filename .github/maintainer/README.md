# Maintainer Delivery Tools

**Maintainers only.** Contributors use the [GitHub Project board](https://github.com/users/itxSaaad/projects/2) directly — no scripts required.

## Prerequisites

- `gh` CLI authenticated with `project`, `repo`, `read:org` scopes
- Python 3.11+

## Commands

From repository root:

```powershell
# Full sync (dupes, hierarchy, fields, milestones, verify)
python .github/maintainer/sync-delivery.py --all

# Regenerate sprint arrays from planning/sprints (then run --all)
python .github/maintainer/build-manifest.py
python .github/maintainer/sync-delivery.py --all
```

| Flag | Action |
|------|--------|
| `--cleanup-dupes` | Remove #61–#68 from project; delete or close duplicates |
| `--hierarchy` | Repair epic/story sub-issue links |
| `--fields` | Set Status, Epic, Priority, Ticket ID, Sprint on all items |
| `--milestones` | Assign gate milestones |
| `--verify` | Item count + GraphQL field gap check |

## Files

- `delivery-manifest.json` — canonical issue numbers and field metadata
- `sync-delivery.py` — GitHub Project sync
- `build-manifest.py` — refresh sprint issue lists from `planning/sprints/`

See [`docs/ops/MAINTAINER_DELIVERY.md`](../../docs/ops/MAINTAINER_DELIVERY.md).
