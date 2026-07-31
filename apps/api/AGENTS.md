# apps/api — agent context

FastAPI backend (`@medlens/api`) for MedLens+.

## Development notes

- Use the workspace commands from [CLAUDE.md](CLAUDE.md).
- Keep the API aligned with the web and mobile package conventions.
- Follow the repository safety and privacy guardrails for any PHI, AI output, or logging.
- Prefer shared contracts and package conventions over app-local duplication.
- When working with FastAPI, Pydantic, or async integrations, refer to the official framework and package documentation before changing architecture or adding new patterns.

## Reference

- FastAPI docs: <https://fastapi.tiangolo.com/>
- Pydantic docs: <https://docs.pydantic.dev/>
- Uvicorn docs: <https://www.uvicorn.org/>
- Monorepo guidance: [../../AGENTS.md](../../AGENTS.md)
