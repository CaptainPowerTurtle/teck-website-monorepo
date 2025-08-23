# syntax=docker/dockerfile:1
FROM node:22-bullseye-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install small runtime build deps and enable corepack + pnpm
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates git curl build-essential python3 \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable \
    && corepack prepare pnpm@10.15.0 --activate

FROM base AS builder
WORKDIR /work
COPY . .

# Use pnpm dlx turbo to prune (no global turbo). Use BuildKit cache for pnpm.
RUN --mount=type=cache,target=/root/.cache/pnpm \
    pnpm dlx turbo@latest prune --scope=@repo/web --docker

FROM base AS installer
WORKDIR /work

# allow passing TURBO_TEAM as a build-arg and expose as env
ARG TURBO_TEAM
ENV TURBO_TEAM=${TURBO_TEAM:-}

# Copy pruned workspace metadata and sources
COPY --from=builder /work/out/json/ ./out/json/
COPY --from=builder /work/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /work/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /work/out/full/ ./

# Install dependencies using cached pnpm store
RUN --mount=type=cache,target=/root/.cache/pnpm \
    pnpm install --frozen-lockfile --store=/root/.cache/pnpm

ENV SKIP_ENV_VALIDATION=true
ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL:-}
ARG REDIS_AVAILABLE
ENV REDIS_AVAILABLE=${REDIS_AVAILABLE:-false}

# Build using turbo via pnpm dlx; pass secrets via BuildKit secrets.
# - turbo_token must be passed as a build secret (id=turbo_token)
# - payload_secret and database_uri should also be provided as secrets
RUN --mount=type=secret,id=turbo_token \
    --mount=type=secret,id=payload_secret \
    --mount=type=secret,id=database_uri \
    --mount=type=cache,target=/root/.cache/pnpm \
    --mount=type=cache,target=/work/.turbo \
    /bin/sh -c '\
    if [ -f /run/secrets/turbo_token ]; then export TURBO_TOKEN="$(cat /run/secrets/turbo_token)"; fi && \
    export PAYLOAD_SECRET="$(cat /run/secrets/payload_secret)" && \
    export DATABASE_URI="$(cat /run/secrets/database_uri)" && \
    # TURBO_TEAM is available as env if provided via build-arg; turbo CLI will use TURBO_TOKEN/TURBO_TEAM if present
    pnpm dlx turbo@latest run build --filter=@repo/web... \
    '

FROM node:22-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy Next standalone output (one-step ownership)
COPY --from=installer --chown=nextjs:nodejs /work/apps/web/.next/standalone/ ./
COPY --from=installer --chown=nextjs:nodejs /work/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /work/apps/web/public ./apps/web/public

USER nextjs
EXPOSE 3000
CMD ["node", "apps/web/server.js"]