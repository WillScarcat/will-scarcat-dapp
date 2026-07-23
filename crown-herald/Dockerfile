# Multi-stage: builder has devDependencies (typescript, tsx) to compile and
# to run generate-notes.ts once; runtime only installs production deps.
FROM node:20-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY src ./src
COPY scripts ./scripts

RUN npm run build
RUN npm run generate:notes

FROM node:20-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/assets ./assets

CMD ["node", "dist/index.js"]
