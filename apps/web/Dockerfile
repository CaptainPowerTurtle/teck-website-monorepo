# syntax=docker.io/docker/dockerfile:1


FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk add --no-cache libc6-compat && \
    corepack enable && \
    pnpm install turbo --global

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
COPY . .

# Generate a partial monorepo with a pruned lockfile for a target workspace.
# Assuming "web" is the name entered in the project's package.json: { name: "web" }
RUN turbo prune --scope=@repo/web --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN corepack enable
RUN pnpm install --frozen-lockfile

# ARG PAYLOAD_SECRET
# ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
# ARG DATABASE_URI
# ENV DATABASE_URI=$DATABASE_URI


# Build the project
# RUN --mount=type=secret,id=payload_secret,env=PAYLOAD_SECRET 
# RUN --mount=type=secret,id=database_uri,env=DATABASE_URI 

COPY --from=builder /app/out/full/ .
RUN --mount=type=secret,id=payload_secret --mount=type=secret,id=database_uri \
    PAYLOAD_SECRET=/run/secrets/payload_secret PAYLOAD_SECRET=/run/secrets/database_uri  \
    pnpm turbo run build --filter=@repo/web...

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

CMD ['node' 'apps/web/server.js']