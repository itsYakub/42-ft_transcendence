# -----------------------------------------------------------------------------
# Build stage
# -----------------------------------------------------------------------------
FROM node:24.6.0-bookworm-slim AS build
WORKDIR /app

# Install deps (use lockfile for reproducibility)
COPY package.json package-lock.json ./
RUN npm ci

# Build sources
COPY . .
RUN npm run build

# Remove devDependencies from the build output
RUN npm prune --omit=dev


# -----------------------------------------------------------------------------
# Runtime stage
# -----------------------------------------------------------------------------
FROM node:24.6.0-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user (uid/gid 1001) and a writable data dir for SQLite
RUN useradd -u 1001 -m nonroot \
  && mkdir -p /data \
  && chown -R 1001:1001 /data

# Copy built app as nonroot owner
COPY --from=build --chown=nonroot:nonroot /app/dist ./dist
COPY --from=build --chown=nonroot:nonroot /app/node_modules ./node_modules

# Drop privileges
USER nonroot

# Expose app port (TLS is terminated by your WAF)
EXPOSE 3000

# Keep a plain node command; compose will source /secrets/app.env before exec
CMD ["node", "dist/app.js"]
