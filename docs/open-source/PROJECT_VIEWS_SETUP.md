# GitHub Project Views Setup (GUI)

Project: [itxSaaad/projects/2](https://github.com/users/itxSaaad/projects/2)

GitHub does not expose a public API to create Project views. Create the six delivery views below in the browser (about 10 minutes).

## Before you start

1. Open the project board link above.
2. Confirm custom fields exist: **Status**, **Epic**, **Priority**, **Ticket ID**, **Sprint**.
3. If fields are empty on items, a maintainer runs `python .github/maintainer/sync-delivery.py --all` first.

---

## Step 1 — Delivery Board

1. Click **+** next to the view tabs (or **New view**).
2. Choose layout **Board**.
3. Click **Group by** → select **Status**.
4. Click **Sort** → **Priority** → ascending.
5. Click the view name → **Rename view** → `Delivery Board`.
6. **Save changes**.

## Step 2 — Current Sprint

1. **+ New view** → layout **Board**.
2. In the filter bar, enter: `iteration:"SPRINT-02" -status:"Done"`
   - Or use the UI: Sprint = SPRINT-02, Status is not Done.
3. Group by **Status**, sort by **Priority** ascending.
4. Rename to `Current Sprint` → **Save changes**.

## Step 3 — Epic Roadmap

1. **+ New view** → layout **Roadmap**.
2. Group by **Epic**.
3. Rename to `Epic Roadmap` → **Save changes**.

## Step 4 — Phase Table

1. **+ New view** → layout **Table**.
2. Show columns: **Title**, **Ticket ID**, **Status**, **Epic**, **Priority**, **Milestone**, **Sprint** (hide unused columns).
3. Rename to `Phase Table` → **Save changes**.

## Step 5 — Contributor Queue

1. **+ New view** → layout **Table**.
2. Filter: `status:"Ready"` OR `label:"good first issue"`
3. Rename to `Contributor Queue` → **Save changes**.

## Step 6 — Sub-task Tracker

1. **+ New view** → layout **Table**.
2. Filter: `label:"type:sub-task"`
3. Optional: group by parent issue if your UI supports it.
4. Rename to `Sub-task Tracker` → **Save changes**.

## Step 7 — Cleanup

1. Open tabs named **View 2**, **View 3**, or other unnamed defaults.
2. **View** menu → **Delete view** (only after the six named views above exist).

## Verify

You should see six tabs:

| View | Layout |
|------|--------|
| Delivery Board | Board |
| Current Sprint | Board |
| Epic Roadmap | Roadmap |
| Phase Table | Table |
| Contributor Queue | Table |
| Sub-task Tracker | Table |

## Filter reference

| View | Filter query |
|------|----------------|
| Current Sprint | `iteration:"SPRINT-02" -status:"Done"` |
| Contributor Queue | `status:"Ready" OR label:"good first issue"` |
| Sub-task Tracker | `label:"type:sub-task"` |

When the active sprint changes, edit **Current Sprint** filter to the new `SPRINT-XX` iteration.
