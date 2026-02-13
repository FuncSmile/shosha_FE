# Use Node.js LTS (20.x for compatibility with Vite 7+)
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps

# Install build dependencies
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++

WORKDIR /app

# Copy package files (include lock for consistent builds)
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --no-audit --no-fund || \
    npm install --legacy-peer-deps --no-audit --no-fund

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files
COPY . .

# Verify critical files exist
RUN echo "========== VERIFYING BUILD CONTEXT ==========" && \
    ls -la && \
    echo "" && \
    echo "Checking required files..." && \
    if [ ! -f nuxt.config.ts ]; then echo "✗ ERROR: nuxt.config.ts missing"; exit 1; else echo "✓ nuxt.config.ts exists"; fi && \
    if [ ! -f tsconfig.json ]; then echo "✗ ERROR: tsconfig.json missing"; exit 1; else echo "✓ tsconfig.json exists"; fi && \
    if [ ! -f package.json ]; then echo "✗ ERROR: package.json missing"; exit 1; else echo "✓ package.json exists"; fi && \
    echo "========== ALL FILES VERIFIED ✓ =========="

# Build arguments for Nuxt (can be overridden)
ARG NODE_ENV=production
ARG NUXT_PUBLIC_API_BASE=http://localhost/api

# Set environment variables for build
ENV NODE_ENV=$NODE_ENV
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE

# Build the application with error handling
RUN npm run build || \
    (echo "========== BUILD FAILED ==========" && \
     echo "Checking Nuxt config:" && \
     cat nuxt.config.ts && \
     echo "" && \
     echo "Checking TypeScript config:" && \
     cat tsconfig.json && \
     echo "" && \
     echo "Environment variables:" && \
     env | grep -E 'NODE_ENV|NUXT' && \
     exit 1)

# Verify build output
RUN test -d .output && echo "✓ Build successful - .output directory created" || \
    (echo "✗ Build failed - no .output directory" && exit 1)

# Production image, copy all the files and run Nuxt
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtjs

# Copy built application
COPY --from=builder /app/.output /app/.output

# Change ownership
RUN chown -R nuxtjs:nodejs /app

USER nuxtjs

EXPOSE 3000

ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["node", ".output/server/index.mjs"]
