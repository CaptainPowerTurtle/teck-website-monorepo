# syntax=docker/dockerfile:1.4

# Multi-arch friendly Dockerfile. Works with your existing matrix-based buildx runs.
ARG BUILDPLATFORM
ARG TARGETPLATFORM
ARG TARGETARCH

FROM --platform=$BUILDPLATFORM node:22-bullseye-slim AS base
ENV PNPM_HOME="/pnpm" PATH="$PNPM_HOME:$PATH"
# Install minimal build deps once, enable corepack + install pnpm
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates git curl build-essential python3 \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable \
    && corepack prepare pnpm@10.15.0 --activate

# Prune the monorepo to reduce context for installs and build
FROM base AS pruner
WORKDIR /work
COPY . .
# Use cache mounts for pnpm and .turbo; produce out/ used by next steps
RUN --mount=type=cache,target=/root/.cache/pnpm \
    --mount=type=cache,target=/work/.turbo \
    pnpm dlx turbo@latest prune --scope=@repo/web --docker

# Installer + build stage: install deps and run turbo build for target arch
FROM base AS builder
WORKDIR /work
ARG TURBO_TEAM
ENV TURBO_TEAM=${TURBO_TEAM:-}

# Copy pruned artifacts created by prune step
COPY --from=pruner /work/out/full/ ./
COPY --from=pruner /work/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /work/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /work/out/json/ ./out/json/

# Install deps using pnpm cache; build using turbo. Use BuildKit secrets for sensitive values.
RUN --mount=type=cache,target=/root/.cache/pnpm \
    pnpm install --frozen-lockfile --store=/root/.cache/pnpm

ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL:-}
ARG REDIS_AVAILABLE
ENV REDIS_AVAILABLE=${REDIS_AVAILABLE:-false}
ENV SKIP_ENV_VALIDATION=true
ARG APP_VERSION
ENV APP_VERSION=${APP_VERSION:-}

# Build (turbo will respect TURBO_TOKEN/TURBO_TEAM if provided). Mount caches for speed.
RUN --mount=type=secret,id=turbo_token \
    --mount=type=secret,id=payload_secret \
    --mount=type=secret,id=database_uri \
    --mount=type=cache,target=/root/.cache/pnpm \
    --mount=type=cache,target=/work/.turbo \
    /bin/sh -c '\
    # if APP_VERSION provided, write into apps/web/package.json (safe no-op if missing) \
    if [ -n "$APP_VERSION" ]; then \
    if [ -f ./apps/web/package.json ]; then \
    node -e "const fs=require(\"fs\"); const p=\"./apps/web/package.json\"; const pkg=JSON.parse(fs.readFileSync(p)); pkg.version=process.env.APP_VERSION; fs.writeFileSync(p,JSON.stringify(pkg,null,2)); console.log(\"wrote version\",pkg.version);" ; \
    fi ; \
    fi && \
    if [ -f /run/secrets/turbo_token ]; then export TURBO_TOKEN=\"$(cat /run/secrets/turbo_token)\"; fi && \
    if [ -f /run/secrets/payload_secret ]; then export PAYLOAD_SECRET=\"$(cat /run/secrets/payload_secret)\"; fi && \
    if [ -f /run/secrets/database_uri ]; then export DATABASE_URI=\"$(cat /run/secrets/database_uri)\"; fi && \
    pnpm dlx turbo@latest run build --filter=@repo/web... \
    '

# Final runtime: copy only the Next standalone output (smallest image)
FROM --platform=$TARGETPLATFORM node:22-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nextjs

# Copy only runtime output from builder
# .next/standalone contains server.js and package.json and the required node_modules
COPY --from=builder --chown=nextjs:nodejs /work/apps/web/.next/standalone/ ./
# static & public assets
COPY --from=builder --chown=nextjs:nodejs /work/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /work/apps/web/public ./apps/web/public

USER nextjs
EXPOSE 3000
CMD ["node", "apps/web/server.js"]