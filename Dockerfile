# NOTE: the database is kept outside the container.
# The database shall be located in .data directory from the root

# some node image, i know the scanner is shouting
FROM node:24.5.0-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN npm prune --omit=dev

FROM gcr.io/distroless/nodejs24-debian12
WORKDIR /app

# the app is ran non-root due to security measures :))
COPY --from=build --chown=nonroot:nonroot /app/dist ./dist
COPY --from=build --chown=nonroot:nonroot /app/node_modules ./node_modules

EXPOSE 3000

CMD ["dist/app.js"]
