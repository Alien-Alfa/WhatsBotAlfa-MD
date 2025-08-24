# Aurora-MD Production Dockerfile
# Author: AlienAlfa
# Multi-stage build for optimized production image

# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM node:18-alpine AS production

# Install system dependencies
RUN apk add --no-cache \
    ffmpeg \
    git \
    python3 \
    make \
    g++ \
    curl \
    && rm -rf /var/cache/apk/*

# Create app user for security
RUN addgroup -g 1001 -S aurora && \
    adduser -S aurora -u 1001

# Set working directory
WORKDIR /app

# Copy dependencies from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY --chown=aurora:aurora . .

# Create necessary directories
RUN mkdir -p logs session assets/database && \
    chown -R aurora:aurora /app

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

# Switch to non-root user
USER aurora

# Set production environment
ENV NODE_ENV=production
ENV LOG_LEVEL=INFO
ENV ENABLE_FILE_LOGGING=true

# Expose port
EXPOSE ${PORT:-8000}

# Start command
CMD ["npm", "run", "start:production"]

