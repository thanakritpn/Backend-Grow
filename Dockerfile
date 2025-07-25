
FROM node:alpine

WORKDIR /grow

RUN apk add --no-cache openssl

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY prisma ./prisma

RUN npx prisma generate

COPY . .
RUN mv .env.production .env
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
