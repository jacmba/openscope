# Multi-stage Dockerfile for OpenScope ATC Simulator
# Stage 1: Build stage
FROM node:11.3.0-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
    python \
    make \
    g++ \
    git

# Copy package files first for better layer caching
COPY package.json package-lock.json* ./

# Install dependencies with optimizations
RUN npm ci --silent --no-audit --no-fund && \
    npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM node:11.3.0-alpine AS production

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S openscope -u 1001

# Set working directory
WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json* ./
RUN npm install --only=production --silent --no-audit --no-fund && \
    npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=openscope:nodejs /app/public ./public

# Create necessary directories and set permissions
RUN mkdir -p /app/logs && \
    chown -R openscope:nodejs /app

# Switch to non-root user
USER openscope

# Expose port
EXPOSE 3003

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3003', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]
