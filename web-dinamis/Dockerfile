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

# Set placeholder NEXTAUTH_URL saat build (akan di-override saat runtime)
ENV NEXTAUTH_URL=http://localhost:3000

# Build Next.js
RUN npm run build

# 2. Runner
FROM node:24-alpine AS runner

# Set directory
WORKDIR /app

# Environment variable
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Copy build files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Start app — NEXTAUTH_URL akan dibaca dari environment docker-compose
CMD ["node", "server.js"]