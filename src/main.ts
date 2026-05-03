import 'reflect-metadata';
// Load dotenv as EARLY as possible to ensure env vars are ready for TypeORM
import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 3000;

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();