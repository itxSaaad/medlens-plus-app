# Local and Production Runtime

## Local Development (Auto-Restart)

Run:
- `docker compose -f docker-compose.dev.yml up --build`

Included local services:
- `postgres` (document and observation persistence)
- `redis` (queue/cache/event use-cases)
- `minio` (S3-compatible object storage)
- `minio-init` (bootstraps `medlens-reports` bucket)
- `api`
- `web`

Behavior:
- `restart: unless-stopped`
- API uses hot reload
- Web uses Next.js dev mode

## Production Runtime (Manual Restart)

Run:
- `docker compose -f docker-compose.prod.yml up --build -d`

Behavior:
- `restart: "no"`
- Explicit operator-controlled restart policy

## Test Strategy

Unit tests:
- `pnpm test`

Integration tests:
1. Start dev services with Docker compose.
2. Run `pnpm test:integration`.
