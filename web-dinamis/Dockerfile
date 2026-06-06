# 1. Builder
FROM node:24-alpine AS builder

# Set directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build Next.js
RUN npm run build

# 2. Runner
FROM node:24-alpine AS runner

# Set directory
WORKDIR /app

# Environment variable
ENV NODE_ENV=production

# Copy build files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Start app
CMD ["node", "server.js"]