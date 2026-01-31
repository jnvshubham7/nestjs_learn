import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Comment } from '../comments/entities/comment.entity';

/**
 * DATABASE MODULE
 * 
 * Configures database connection using TypeORM.
 * 
 * Key Concepts:
 * - TypeOrmModule.forRoot() - Configure database connection
 * - SQLite: Lightweight, file-based database (great for learning)
 * - Entities: Tell TypeORM which tables to create
 * - synchronize: Auto-create tables (development only!)
 *   WARNING: In production, use migrations instead
 * 
 * SQLite Benefits for Learning:
 * - No installation needed
 * - No external server
 * - Data stored in single file
 * - Perfect for prototyping
 * 
 * For Production:
 * - Use PostgreSQL or MySQL
 * - Use migrations for schema changes
 * - Set synchronize: false
 */
@Module({
  imports: [
    TypeOrmModule.forRoot({
      // Database type
      type: 'sqlite',
      
      // Database file location
      database: 'blog.db',
      
      // Entities (tables) TypeORM should manage
      entities: [User, Post, Comment],
      
      // Auto-create tables on app startup
      // WARNING: Only for development!
      synchronize: true,
      
      // Log SQL queries (helpful for learning)
      logging: true,
      
      // Optional: pretty print logs
      logger: 'simple-console',
    }),
  ],
})
export class DatabaseModule {}
