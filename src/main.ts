import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for frontend origin
  app.enableCors({
    origin: [
      'http://localhost:5174',
      'http://localhost:5175',
      'http://127.0.0.1:5173', 
    'http://localhost:5173',
    ],
    credentials: true, // Allow requests from Vite frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allow these HTTP methods
    allowedHeaders: 'Content-Type,Authorization,ngrok-skip-browser-warning', 
  });

  // Serve static files for profile pictures
  app.useStaticAssets(join(__dirname, '..', 'Uploads'), {
    prefix: '/Uploads/',
  });

  await app.listen(process.env.PORT ?? 80);
}
bootstrap();