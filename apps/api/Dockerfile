# ─── Stage 1: Build ─────────────────────────────────────────────────────────────
FROM node:20-slim AS build

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy source
COPY . .

# Generate Prisma client before build
RUN npx prisma generate

# Compile TypeScript
RUN npm run build

# ─── Stage 2: Production image ──────────────────────────────────────────────────
FROM node:20-slim

WORKDIR /app

# Only copy production artifacts
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./

EXPOSE 3000

# Run Prisma migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
