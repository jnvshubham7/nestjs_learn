import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { Post } from '../posts/entities/post.entity';

/**
 * COMMENTS MODULE
 * 
 * Feature module for comment management.
 * 
 * Handles:
 * - Adding comments to posts
 * - Deleting comments
 * - Retrieving comments for a post
 * 
 * Dependencies:
 * - Post entity (comments belong to posts)
 * - User entity (comments have authors)
 */
@Module({
  // Register Comment and Post entities
  // Post is needed to verify post exists when creating comment
  imports: [TypeOrmModule.forFeature([Comment, Post])],
  
  // Routes: /comments
  controllers: [CommentsController],
  
  // Service
  providers: [CommentsService],
})
export class CommentsModule {}
