# Contributing to MedLens+

Thanks for contributing.

## Setup Expectations
- Read `README.md`
- Read `AGENTS.md`
- Pick one **Ready** issue from the [GitHub Project Board](https://github.com/users/itxSaaad/projects/2)
- Confirm scope before coding

## Workflow
1. Fork repository
2. Sync `main`, then create branch: `feat/TKT-XXX-short-slug` **from `main`**
3. Implement small, reviewable commits on your feature branch
4. Add/adjust tests
5. Run `pnpm graphify:update` if you changed architecture or module boundaries
6. Open PR to **`develop`** using PR template with `Closes #NNN`
7. Hotfixes: branch from `main`, PR to **`main`** (maintainers backmerge to lower branches)

## Commit Convention
Use Conventional Commits:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `refactor:` non-breaking restructure
- `test:` test changes
- `chore:` tooling/maintenance

## Code Review Rules
- No silent architecture deviations
- No medical-risky copy changes without safety review
- No schema changes without migration notes

## What To Work On
Start from:
- [MedLens+ Project Board](https://github.com/users/itxSaaad/projects/2) — filter **Status = Ready**
- `docs/open-source/GITHUB_PROJECTS.md` — hierarchy, milestones, and status model

## Milestones and Sprints
- **Milestones** track gate exits (Gate A Foundation → Gate B MVP → Gate C Beta).
- **Sprint** iteration on the project board groups work into 2–3 week cycles (SPRINT-01 … SPRINT-06).
- Current active sprint: **SPRINT-02** (platform skeleton; pick `TKT-013` next).

## Community Conduct
By participating, you agree to `CODE_OF_CONDUCT.md`.
