# Agent Skills Baseline (Codex, Claude, Copilot)

This repository expects coding agents to operate as a software engineering firm.

## Operating Principles
- Architecture first, implementation second
- No hardcoded infra details in business logic
- Tests and docs are part of feature completion
- Safety and privacy constraints are non-negotiable

## Provider-Agnostic Agent Behavior
- Agents must use adapter/factory boundaries already defined
- Any LLM change should happen via provider interface selection, not direct workflow rewrites
- Agent-generated code must preserve env-backed and flag-backed behavior

## CLI Discipline
- Use project scripts for repeatable workflows
- Prefer deterministic commands and explicit outputs
- No silent side-effects in scripts

## Quality Expectations
- Strong typing
- Test coverage for changed behavior
- Clear error handling and observability-safe logs

## Provider-Specific Instruction Files
- `CLAUDE.md` for Claude Code sessions
- `CODEX.md` for Codex sessions
- `.github/copilot-instructions.md` for GitHub Copilot

## Shared Skill Playbooks
- `docs/agent-context/skills/01-repo-governance.md`
- `docs/agent-context/skills/02-mvp-feature-delivery.md`
- `docs/agent-context/skills/03-safety-and-privacy-gate.md`
- `docs/agent-context/skills/04-ci-cd-and-releases.md`
