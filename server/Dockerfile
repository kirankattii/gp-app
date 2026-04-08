# ---------- Base Image ----------
FROM node:20-alpine AS base

WORKDIR /app

# Install OS dependencies
RUN apk add --no-cache openssl

COPY package*.json ./

# ---------- Install Dependencies ----------
FROM base AS deps
RUN npm install

# ---------- Build Stage ----------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build   # Builds TypeScript → dist

# ---------- Production Image ----------
FROM node:20-alpine AS prod

WORKDIR /app

# Install OS dependencies needed by Prisma
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install --omit=dev   # install only prod deps

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

EXPOSE 8000

CMD ["node", "dist/server.js"]