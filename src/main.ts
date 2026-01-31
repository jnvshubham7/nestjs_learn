import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * MAIN ENTRY POINT
 * 
 * This file bootstraps (starts) the NestJS application.
 * 
 * Process:
 * 1. NestFactory.create(AppModule) - Creates app instance from root module
 * 2. AppModule loads all modules (Database, Auth, Users, Posts, Comments)
 * 3. app.listen(port) - Start HTTP server
 * 
 * Port:
 * - Reads from PORT environment variable
 * - Defaults to 3000 if not set
 * - Example: PORT=4000 npm run start
 * 
 * Running the app:
 * - Development: npm run start:dev (watches for changes)
 * - Production: npm run start:prod
 */
async function bootstrap() {
  // Create NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Enable CORS (allow requests from frontend)
  // In production, specify exact origin
  app.enableCors({
    origin: '*', // Allow all origins (for development)
    credentials: true,
  });

  // Get port from environment or use default
  const port = process.env.PORT ?? 3000;

  // Start server
  await app.listen(port);

  console.log(`🚀 Application running on: http://localhost:${port}`);
  console.log(`📚 API Docs: http://localhost:${port}/api`);
}

// Execute bootstrap function
bootstrap();

