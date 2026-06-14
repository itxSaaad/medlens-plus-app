# Commit Strategy (Cherry-Pick Safe)

## Objective
Keep every commit meaningful, reviewable, and safe to cherry-pick into `staging` or `main` when needed.

## Rules
1. One commit should represent one logical change.
2. Do not mix refactor + feature + formatting in one commit.
3. Commit messages must follow Conventional Commits.
4. Every commit must keep tests passing for the touched scope.
5. Avoid "WIP noise" in shared branches; squash/fixup before opening PR when needed.

## Recommended Commit Shapes
- `feat(api): add report type classifier contract`
- `fix(web): handle empty timeline state`
- `test(api): add unit tests for safety filter`
- `docs(ops): clarify feature flag rollout steps`

## Cherry-Pick Readiness Checklist
- Commit compiles independently.
- Commit does not rely on hidden prior local edits.
- Migration/config changes are included in the same commit when required.
- Tests for the changed behavior are part of the commit or already present.
- Commit message explains intent and impact clearly.

## Anti-Patterns
- `fix stuff`
- `updates`
- giant mixed commits touching unrelated domains
- pure formatting commits bundled with behavioral changes

## Enforcement
- CI enforces commit convention and PR title convention.
- Branch ticket-id pattern for `feat`/`fix`/`hotfix`: see [`NAMING_CONVENTIONS.md`](./NAMING_CONVENTIONS.md).
- Commit body lines must be ≤100 characters (commitlint `body-max-line-length`).
- Maintainers should request split commits when a change is not cherry-pick safe.
