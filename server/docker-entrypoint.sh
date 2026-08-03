#!/bin/sh
set -e

# --------------------------------------------------------------------------
# Why "prisma db push" and not "prisma migrate deploy":
# This project has no prisma/migrations directory yet (schema changes have
# been applied with `prisma db push` during development, not `prisma migrate
# dev`). `migrate deploy` requires a migrations history to exist, so it would
# fail here. `db push` synchronizes the database schema to match
# schema.prisma directly, which matches how this project already works.
#
# If the team adopts `prisma migrate dev` later to get a proper, versioned
# migration history, this line should change to `npx prisma migrate deploy`
# instead - that is the correct production command once migrations exist.
# --------------------------------------------------------------------------
echo "Syncing database schema with Prisma..."

attempt=1
max_attempts=10
until npx prisma db push --skip-generate --accept-data-loss; do
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "Prisma db push failed after $max_attempts attempts. Exiting."
    exit 1
  fi
  echo "Database not ready yet (attempt $attempt/$max_attempts). Retrying in 3s..."
  attempt=$((attempt + 1))
  sleep 3
done

echo "Database schema is up to date."

# Hand off execution to the container's CMD (e.g. "npm run start").
# `exec` replaces this shell process with the Node process so that it
# becomes PID 1's direct child and correctly receives SIGTERM for
# graceful shutdown, instead of being a grandchild hidden behind this script.
exec "$@"
