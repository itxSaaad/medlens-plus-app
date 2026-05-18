# Release Process

## Automation
- On every push to `main`, the `release.yml` workflow runs.
- Release automation is enabled only when `RELEASE_PLEASE_TOKEN` is configured.
- If token is missing, workflow exits successfully with a skip message (no false failure).

## Requirements
- Conventional commit messages
- Semantic PR titles
- Green CI checks before merge to `main`
- `RELEASE_PLEASE_TOKEN` secret with repo scope, or equivalent repo settings allowing PR creation by automation

## Why skips are allowed
This keeps `main` pipeline healthy while release credentials are being configured.
