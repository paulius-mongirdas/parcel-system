import { NestFactory } from '@nestjs/core';
import { AppModule } from './appModule';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }))
  await app.listen(3333);
}
bootstrap();