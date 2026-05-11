# Shared Packages Strategy (Python Backend + TypeScript Frontend)

## Decision
Do not force shared runtime code between Python and TypeScript.

## Why
- Different runtimes and packaging ecosystems
- Shared runtime package adds coupling and release friction

## What Should Be Shared
1. Contract schemas (JSON Schema / OpenAPI)
2. Architecture and policy docs
3. Lint/quality conventions at repo level
4. Event contracts and IDs

## Current Pattern
- Frontend shared code: `packages/*` for TS-only utilities/types
- Backend shared code: Python modules in `apps/api/src`
- Cross-language contract source: OpenAPI + schema artifacts (to be added)

## Rule
If both apps need the same model, define it once in contract schema and generate language-specific types.
