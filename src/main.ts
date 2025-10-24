import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join, resolve } from 'path';
import { json, urlencoded } from 'express'; // ✅ เพิ่มตรงนี้

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ เพิ่ม limit ของ request body
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'https://growtogether.typedelta.dev',
      'http://localhost:13002',
      'https://grow.petnok.site'
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,ngrok-skip-browser-warning',
  });

  // ✅ serve static from real root/uploads
  const uploadsPath = resolve(process.cwd(), 'uploads');
  console.log('📂 Serving static files from:', uploadsPath);

  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${process.env.PORT ?? 3000}`);
});
}
bootstrap();
