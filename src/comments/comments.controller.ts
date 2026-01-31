import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

/**
 * COMMENTS CONTROLLER
 * 
 * Handles comment endpoints:
 * - GET /posts/:postId/comments - Get all comments on a post (public)
 * - POST /posts/:postId/comments - Add comment (authenticated)
 * - DELETE /comments/:id - Delete comment (owner only)
 * 
 * Routing Pattern:
 * - Nested routes: /posts/:postId/comments
 * - This shows hierarchical relationship
 */
@Controller()
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  /**
   * Get all comments for a post
   * 
   * Route: GET /posts/:postId/comments
   * Public: No authentication required
   * 
   * Returns comments in order of creation
   * Includes comment author information
   * 
   * Example:
   * GET /posts/550e8400-e29b-41d4-a716-446655440000/comments
   * 
   * @param postId - ID of post to get comments for
   * @returns Array of comments with authors
   */
  @Get('/posts/:postId/comments')
  async getPostComments(@Param('postId') postId: string) {
    return this.commentsService.findByPostId(postId);
  }

  /**
   * Add comment to a post
   * 
   * Route: POST /posts/:postId/comments
   * Protected: Requires valid JWT token
   * 
   * Request body:
   * {
   *   "content": "Great post! I really enjoyed this."
   * }
   * 
   * Author is automatically set from JWT token
   * 
   * Example:
   * POST /posts/550e8400-e29b-41d4-a716-446655440000/comments
   * 
   * @param postId - ID of post to comment on
   * @param createCommentDto - Comment content
   * @param currentUser - Authenticated user (comment author)
   * @returns Created comment with author
   */
  @Post('/posts/:postId/comments')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.commentsService.create(postId, createCommentDto, currentUser);
  }

  /**
   * Delete a comment
   * 
   * Route: DELETE /comments/:id
   * Protected: Requires valid JWT token
   * Authorization: Only comment author can delete
   * 
   * @param id - Comment ID
   * @param currentUser - Authenticated user
   * @returns Success message
   */
  @Delete('/comments/:id')
  @UseGuards(JwtAuthGuard)
  async deleteComment(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.commentsService.delete(id, currentUser);
  }
}
