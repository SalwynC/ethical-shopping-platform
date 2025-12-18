import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import serverless from 'serverless-http';
import { AppModule } from '../src/app.module';

// Create an Express instance to be managed by Nest
const expressApp = express();

async function createServerlessHandler() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );
  await app.init();
  // Wrap the Express app with serverless-http for Vercel
  return serverless(expressApp);
}

let handlerPromise: Promise<ReturnType<typeof serverless>> | null = null;

export default async function handler(req: any, res: any) {
  if (!handlerPromise) {
    handlerPromise = createServerlessHandler();
  }
  const handlerFn = await handlerPromise;
  return handlerFn(req, res);
}
