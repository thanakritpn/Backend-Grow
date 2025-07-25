# FROM node:alpine

# WORKDIR /grow

# # ติดตั้ง openssl ถ้าต้องใช้สำหรับ gen secret
# RUN apk add --no-cache openssl

# COPY package*.json ./
# RUN npm ci --omit=dev && npm cache clean --force

# # 📌 ต้อง COPY prisma ก่อน generate
# COPY prisma ./prisma
# RUN npx prisma generate

# # ค่อย COPY ไฟล์อื่นทั้งหมดภายหลัง
# COPY . .

# # (แนะนำ) อย่าทำ .env ใน build time
# # RUN cp .env.production .env
# # RUN echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env

# EXPOSE 3000

# CMD ["npm", "run", "start"]



FROM node:alpine

# สร้างโฟลเดอร์ใน container
WORKDIR /grow

# ติดตั้ง openssl สำหรับ gen secret หากจำเป็น
RUN apk add --no-cache openssl

# คัดลอกไฟล์ package สำหรับติดตั้ง dependency
COPY package*.json ./

# ติดตั้ง dependencies ทั้งหมด รวมถึง devDependencies
RUN npm ci && npm cache clean --force

# คัดลอก prisma ก่อน generate
COPY prisma ./prisma
RUN npx prisma generate

# คัดลอกไฟล์ทั้งหมดภายหลัง
COPY . .

# เปิดพอร์ต 3000
EXPOSE 3000

# รัน NestJS แบบสด (compile ตอนรัน)
CMD ["npm", "run", "start"]
