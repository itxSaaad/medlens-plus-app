# Quality Gates

Every PR targeting `develop` or `main` must pass:

1. Branch naming validation
2. JS lint + markdown lint
3. JS typecheck
4. JS unit tests
5. JS build
6. Python ruff lint
7. Python mypy typecheck
8. Python unit tests
9. Commit + PR convention checks
10. Review comments addressed for blocking findings (including CodeRabbit critical findings)

## Integration Gates (Pre-release)

- Web integration tests: `pnpm --filter @medlens/web test:integration`
- API integration tests: `pnpm --filter @medlens/api test:integration`

## Local Pre-Push Checklist

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Governance Expectations

- No direct push to long-lived branches.
- PR approvals required by branch protection.
- Merged feature branches are auto-deleted by CI cleanup job.
