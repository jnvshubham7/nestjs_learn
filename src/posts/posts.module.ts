import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';

/**
 * POSTS MODULE
 * 
 * Feature module for post management.
 * 
 * Handles:
 * - Creating, reading, updating, deleting posts
 * - Liking posts
 * 
 * Dependencies:
 * - User entity (for foreign key)
 * - Comment entity (for cascade delete)
 */
@Module({
  // Register Post entity
  imports: [TypeOrmModule.forFeature([Post])],
  
  // Routes: /posts
  controllers: [PostsController],
  
  // Business logic
  providers: [PostsService],
  
  // Export for other modules
  exports: [PostsService],
})
export class PostsModule {}
