import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';

/**
 * APP MODULE - ROOT MODULE
 * 
 * Concept: The root module that boots the application.
 * All other modules are imported here.
 * 
 * Module Organization:
 * - DatabaseModule: Database configuration (TypeORM)
 * - AuthModule: Authentication (login, register)
 * - UsersModule: User management
 * - PostsModule: Post management
 * - CommentsModule: Comment management
 * 
 * ValidationPipe:
 * - Global pipe that validates DTOs
 * - Automatically validates @Body() against DTO classes
 * - Rejects invalid requests before they reach handlers
 */
@Module({
  // Import all feature modules
  imports: [
    DatabaseModule, // Database setup
    AuthModule,     // Authentication
    UsersModule,    // Users
    PostsModule,    // Posts
    CommentsModule, // Comments
  ],
  
  // Root controllers
  controllers: [AppController],
  
  // Root services
  providers: [
    AppService,
    
    // Global ValidationPipe
    // Applied to all endpoints automatically
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,      // Remove unknown properties
        forbidNonWhitelisted: true, // Reject unknown properties
        transform: true,      // Auto-transform types
      }),
    },
  ],
})
export class AppModule {}
