# NOTE: the database is kept outside the container.
# The database shall be located in .data directory from the root

FROM node:24.5.0-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN npm prune --omit=dev

# --- Runtime: use slim (needs /bin/sh to source env), still run as nonroot ---
FROM node:24.5.0-bookworm-slim
WORKDIR /app

# Add a nonroot user (uid/gid 1001 to mirror "nonroot")
RUN useradd -u 1001 -m nonroot

COPY --from=build --chown=nonroot:nonroot /app/dist ./dist
COPY --from=build --chown=nonroot:nonroot /app/node_modules ./node_modules

USER nonroot
EXPOSE 3000

# We use `sh -c` in compose, so keep a plain node command here
CMD ["node", "dist/app.js"]
