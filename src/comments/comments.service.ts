import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';

/**
 * COMMENTS SERVICE
 * 
 * Handles comment operations:
 * - Create comments on posts
 * - Delete comments (owner only)
 * - Get all comments for a post
 * 
 * Key Concepts:
 * - Nested relationships: Comments belong to Post, which belongs to User
 * - Authorization: Only comment author can delete
 */
@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  /**
   * Create a new comment on a post
   * 
   * @param postId - Post to comment on
   * @param createCommentDto - Comment content
   * @param author - Authenticated user (comment author)
   * @returns Created comment with author
   * @throws NotFoundException if post doesn't exist
   */
  async create(
    postId: string,
    createCommentDto: CreateCommentDto,
    author: User,
  ) {
    // Verify post exists
    const post = await this.postsRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    // Create comment
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      post,
      postId,
      author,
      authorId: author.id,
    });

    // Save to database
    await this.commentsRepository.save(comment);

    return comment;
  }

  /**
   * Get all comments for a post
   * 
   * Returns comments in order they were created
   * Includes author info for each comment
   * 
   * @param postId - Post ID
   * @returns Array of comments
   * @throws NotFoundException if post doesn't exist
   */
  async findByPostId(postId: string) {
    // Verify post exists
    const post = await this.postsRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return this.commentsRepository.find({
      where: { postId },
      relations: ['author'], // Load author info
      order: { createdAt: 'ASC' }, // Oldest first
    });
  }

  /**
   * Delete a comment
   * 
   * Authorization Check:
   * - Only comment author can delete
   * 
   * @param commentId - Comment ID
   * @param currentUser - Authenticated user
   * @throws NotFoundException if comment not found
   * @throws ForbiddenException if user is not author
   */
  async delete(commentId: string, currentUser: User) {
    // Find comment
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    // Check authorization
    if (comment.author.id !== currentUser.id) {
      throw new ForbiddenException(
        'You are not authorized to delete this comment',
      );
    }

    // Delete comment
    await this.commentsRepository.delete(commentId);

    return { message: 'Comment deleted successfully' };
  }
}
