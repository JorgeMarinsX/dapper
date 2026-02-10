FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile 2>/dev/null || bun install

# Development stage
FROM base AS dev
COPY package.json bun.lock* ./
RUN bun install
COPY . .
EXPOSE 3000 24678
CMD ["bun", "run", "dev"]

# Build stage
FROM deps AS build
COPY . .
RUN bun run build

# Production stage
FROM base AS production
COPY --from=build /app/.output /app/.output
EXPOSE 3000
CMD ["bun", ".output/server/index.mjs"]
