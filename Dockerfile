
# FROM node:alpine

# WORKDIR /grow

# RUN apk add --no-cache openssl

# COPY package*.json ./

# RUN npm ci && npm cache clean --force

# COPY prisma ./prisma

# RUN npx prisma generate

# COPY . .
# RUN mv .env.production .env
# EXPOSE 3000

# CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
FROM node:alpine

WORKDIR /backend

# ✅ ติดตั้ง openssl และ ca-certificates เพื่อให้ต่อ SSL (Supabase) ได้
RUN apk add --no-cache openssl ca-certificates

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

# ✅ ใช้ .env.production เป็น .env
RUN mv .env.production .env

EXPOSE 3000

# ✅ start server without running migrations at startup (DB already migrated in most envs)
CMD ["sh", "-c", "npm run start"]
