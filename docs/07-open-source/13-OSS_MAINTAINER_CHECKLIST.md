# OSS Maintainer Checklist

Use this checklist before merging PRs.

## Review Checklist

- [ ] PR linked to ticket/issue
- [ ] Problem statement and scope clear
- [ ] Architecture boundaries respected (interfaces/factories)
- [ ] Env-backed config used (no hardcoded secrets/endpoints)
- [ ] Feature flags considered for risky behavior
- [ ] Unit tests added/updated
- [ ] Integration tests updated where needed
- [ ] Docs updated to reflect code behavior
- [ ] Safety rules preserved (medical constraints)
- [ ] CI checks all green

## Release Checklist

- [ ] PR merged to `main` (squash)
- [ ] CI green, `semantic-release` ran
- [ ] changelog/release notes reviewed
