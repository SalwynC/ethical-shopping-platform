import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: true,
      credentials: true,
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    const port = process.env.PORT ? Number(process.env.PORT) : 4000;
    await app.listen(port);
    console.log(`🚀 Backend server running on http://localhost:${port}`);
    
    // Keep process alive
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received');
      app.close();
    });
    process.on('SIGINT', () => {
      console.log('SIGINT signal received');
      app.close();
    });
  } catch (error) {
    console.error('Failed to bootstrap application', error);
    process.exit(1);
  }
}

bootstrap();

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
});

