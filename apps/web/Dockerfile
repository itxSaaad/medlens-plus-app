# syntax=docker/dockerfile:1
FROM node:22-slim AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends wget && rm -rf /var/lib/apt/lists/*
RUN --mount=type=cache,target=/root/.npm npm install -g pnpm@10.25.0
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/logger/package.json packages/logger/package.json
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile=false --ignore-scripts

FROM node:22-slim AS builder
WORKDIR /app
RUN --mount=type=cache,target=/root/.npm npm install -g pnpm@10.25.0
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages/types/node_modules ./packages/types/node_modules
COPY --from=deps /app/packages/logger/node_modules ./packages/logger/node_modules
COPY . .
RUN pnpm --filter @medlens/web build

FROM node:22-slim AS runner
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends wget && rm -rf /var/lib/apt/lists/*
RUN --mount=type=cache,target=/root/.npm npm install -g pnpm@10.25.0
ENV NODE_ENV=production
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/node_modules ./apps/web/node_modules
RUN chown -R node:node /app
USER node
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s --retries=10 \
    CMD wget -q -O - http://localhost:3000/api/health || exit 1
CMD ["pnpm", "--filter", "@medlens/web", "start"]
