# syntax=docker/dockerfile:1

# =============================================================================
# STAGE 1: "deps" - install ALL dependencies (prod + dev) once.
# Cached separately from source code so `npm ci` only re-runs when
# package*.json actually changes, not on every source edit.
# =============================================================================
FROM node:20-alpine AS deps
WORKDIR /app

# Only copy manifest files first -> Docker layer cache stays valid for `npm ci`
# as long as dependencies haven't changed, even if application code changes.
COPY package.json package-lock.json ./
RUN npm ci


# =============================================================================
# STAGE 2: "builder" - compile TypeScript -> JavaScript and generate the
# Prisma Client. This stage has devDependencies (typescript, prisma CLI, @types/*)
# available, which the final runtime image must NOT contain.
# =============================================================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

# Generates node_modules/.prisma/client (typed query engine bindings) based on
# schema.prisma. Must run before `tsc`, and must run again in this stage
# (not just once in "deps") because prisma/schema.prisma is copied here.
RUN npx prisma generate

# Compiles src/**/*.ts -> dist/**/*.js (rootDir/outDir configured in tsconfig.json)
RUN npm run build


# =============================================================================
# STAGE 3: "production" - minimal runtime image.
# Only prod dependencies + compiled JS + generated Prisma client are copied in.
# No TypeScript source, no devDependencies, no build tools -> smaller image,
# smaller attack surface, faster container startup.
# =============================================================================
FROM node:20-alpine AS production
WORKDIR /app

# dumb-init becomes PID 1 and correctly forwards SIGTERM/SIGINT to the Node
# process, so `docker stop` / `docker compose down` trigger a clean, graceful
# shutdown (see Phase 3) instead of Docker force-killing the container after
# its 10s timeout.
RUN apk add --no-cache dumb-init

# Run as a non-root user. Running containers as root is a well-known
# escalation risk if the process is ever compromised.
RUN addgroup -g 1001 -S nodejs && adduser -S nodeuser -u 1001

ENV NODE_ENV=production

COPY package.json package-lock.json ./
# --omit=dev: install ONLY runtime dependencies (express, prisma client, etc.)
# --ignore-scripts: package.json has no postinstall Prisma-generate step, and
# skipping lifecycle scripts here avoids re-downloading engine binaries we
# already generated in the "builder" stage.
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Bring in build artifacts from the "builder" stage:
# - dist: compiled JavaScript that actually runs in production
# - prisma: schema + migrations, needed at container start for `prisma migrate deploy`
# - node_modules/.prisma: the generated Prisma Client engine + types
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh && chown -R nodeuser:nodejs /app

USER nodeuser

EXPOSE 5000

# Confirms the Node process is alive and accepting connections. Any HTTP
# response (even a 404) proves the event loop and TCP listener are up;
# a dedicated /health route is added in Phase 3 for a more precise check.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:' + (process.env.PORT || 5000) + '/', r => process.exit(0)).on('error', () => process.exit(1))"

ENTRYPOINT ["dumb-init", "--", "./docker-entrypoint.sh"]
CMD ["npm", "run", "start"]
