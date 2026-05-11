# Release Process

## Automation
- On every push to `main`, the `release.yml` workflow runs.
- Release Please computes semantic version based on conventional commits.
- It updates `CHANGELOG.md` and opens/updates the release PR.
- When the release PR is merged, a GitHub Release and tag are created.

## Requirements
- Conventional commit messages
- Semantic PR titles
- Green CI checks before merge to `main`
