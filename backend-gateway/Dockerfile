# Multi-stage production Dockerfile for AdaptFlow Backend Gateway & Frontend Host
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV ML_SERVICE_URL=http://ml-service:8000

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy dependencies and build assets
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY server.js ./
COPY server ./server

# Non-root user
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/monitoring/status || exit 1

CMD ["node", "server.js"]
