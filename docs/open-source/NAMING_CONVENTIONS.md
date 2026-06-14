# Naming Conventions (Branches, Commits, PRs)

CI enforces these rules on every PR to `develop`, `staging`, and `main`. Agents and contributors must follow them **before** opening a PR.

## Branches

Branch **from `main`**. PR target: **`develop`** (features/fixes) or **`main`** (hotfixes).

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feat/TKT-<id>-<slug>` | `feat/TKT-013-env-strategy-config` |
| Bug fix | `fix/TKT-<id>-<slug>` | `fix/TKT-052-1-block-diagnosis-phrasing` |
| Hotfix | `hotfix/TKT-<id>-<slug>` | `hotfix/TKT-021-storage-adapter` |
| Chore / docs / CI / refactor / test / release | `<type>/<scope-slug>` | `chore/governance-agent-skills` |

Rules:

- Use lowercase kebab-case slugs (`env-strategy-config`, not `EnvStrategy`).
- Ticket id matches the GitHub issue title (`TKT-013`, `TKT-052.1` → use `TKT-052-1` in branch if dots are awkward).
- **feat / fix / hotfix** must include `TKT-<number>` — CI rejects `feat/my-feature` without a ticket id.
- Repo-wide governance (no single ticket): use **`chore/`**, **`docs/`**, or **`ci/`** prefix instead of `feat/`.

## Commits (Conventional Commits + commitlint)

Enforced locally by Husky (`commit-msg`) and in CI (`wagoid/commitlint-github-action`).

**Subject line:**

```
<type>(<optional-scope>): <short description>
```

- **Types:** `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `release`
- **Lowercase subject** — no PascalCase product names in the subject (`cursor` not `Cursor`)
- **Max ~72 characters** on the subject line
- Imperative mood: `add`, `fix`, `update` (not `added`, `fixes`)

**Body (optional):**

- Wrap lines at **≤100 characters** (`body-max-line-length`)
- Blank line between subject and body

Examples:

```text
feat(api): add signed upload endpoint contract

Add request/response schemas and adapter interface for object storage.
Tests cover validation errors and missing env configuration.
```

```text
chore(ops): bypass PR reviews temporarily for solo maintainer

Disable CODEOWNERS review gate and set zero required approvals on
develop, staging, and main while keeping PR-only merges and CI checks.
```

Anti-patterns (CI **fails**):

- `fix stuff`, `updates`, `WIP`
- Body lines longer than 100 characters
- `feat(agents): consolidate Cursor and Claude skills` (PascalCase in subject)

## Pull requests

| Field | Rule |
|-------|------|
| **Title** | Same format as commit subject — semantic PR title (`feat: …`, `chore: …`) |
| **Body** | [PR template](../../.github/pull_request_template.md): ticket link, problem, solution, checklists |
| **Ticket** | `Closes #NNN` or `Relates to #NNN` |
| **Size** | ≤150 changed files recommended for AI review; ≤400 lines meaningful diff |

PR title is checked by `amannn/action-semantic-pull-request` with the same types as commits.

## Pre-PR checklist (agents)

1. Pick a **Ready** issue on [Project #2](https://github.com/users/itxSaaad/projects/2)
2. Create branch with correct prefix and `TKT-` id (or `chore/` for repo governance)
3. Commits: conventional, lowercase subject, body lines ≤100 chars
4. Run `pnpm lint` (includes markdownlint on `**/*.md`)
5. Run `pnpm graphify:update` manually if structure changed before push; commit graph artifacts if CI requires it (not auto-run on commit)
6. PR title matches conventional format; body uses template

## CI jobs that enforce this

- **Branch Naming Validation** — [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)
- **Commit And PR Convention Checks** — commitlint + semantic PR title
- **JS Quality** — includes `pnpm lint:md` (markdownlint)

See also: [`COMMIT_STRATEGY.md`](./COMMIT_STRATEGY.md), [`BRANCHING_STRATEGY.md`](./BRANCHING_STRATEGY.md), [`PR_REVIEW_AND_PROTECTION_POLICY.md`](./PR_REVIEW_AND_PROTECTION_POLICY.md).
