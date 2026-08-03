# syntax=docker/dockerfile:1

# =============================================================================
# STAGE 1: "builder" - install deps and produce a static production build.
# React/Vite apps compile down to plain HTML/CSS/JS; nothing about Node.js
# needs to exist in the final image.
# =============================================================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Runs "tsc -b && vite build" (unchanged script from package.json).
# Output goes to client/dist/ - static files only.
RUN npm run build


# =============================================================================
# STAGE 2: "production" - nginx serving the static build.
# nginx:alpine is ~40MB total vs. several hundred MB for a Node image, and it
# is purpose-built for serving static files efficiently, so this is both
# smaller and faster than running `vite preview` in production.
# =============================================================================
FROM nginx:1.27-alpine AS production

# Custom config adds a client-side-routing fallback (see nginx.conf) - without
# it, refreshing the browser on any route other than "/" (e.g. /post/my-slug)
# would 404 because that path doesn't exist as a physical file.
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
