import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

/**
 * POSTS CONTROLLER
 * 
 * Handles post endpoints:
 * - GET /posts - List all posts (public)
 * - GET /posts/:id - Get single post (public)
 * - POST /posts - Create post (authenticated)
 * - PUT /posts/:id - Update post (owner only)
 * - DELETE /posts/:id - Delete post (owner only)
 * - POST /posts/:id/like - Like post (authenticated)
 * 
 * Key Patterns:
 * - Public routes: GET endpoints without @UseGuards
 * - Protected routes: POST/PUT/DELETE with @UseGuards(JwtAuthGuard)
 */
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  /**
   * Get all posts (public)
   * 
   * Route: GET /posts?page=1&pageSize=10
   * 
   * Supports pagination:
   * - page: Page number (default: 1)
   * - pageSize: Items per page (default: 10)
   * 
   * Returns:
   * {
   *   "data": [{ posts }],
   *   "total": 100,
   *   "page": 1,
   *   "pageSize": 10,
   *   "totalPages": 10
   * }
   * 
   * @param page - Page number
   * @param pageSize - Items per page
   * @returns Paginated posts with pagination metadata
   */
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.postsService.findAll(page, pageSize);
  }

  /**
   * Get single post (public)
   * 
   * Route: GET /posts/:id
   * 
   * Returns:
   * - Post data
   * - Author information
   * - All comments with comment authors
   * 
   * @param id - Post ID
   * @returns Post with author and comments
   */
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.postsService.findById(id);
  }

  /**
   * Create new post
   * 
   * Route: POST /posts
   * Protected: Requires valid JWT token
   * 
   * Request body:
   * {
   *   "title": "My First Post",
   *   "content": "This is the content of my first post...",
   *   "imageUrl": "https://example.com/image.jpg" (optional)
   * }
   * 
   * Response:
   * {
   *   "id": "uuid",
   *   "title": "My First Post",
   *   "content": "...",
   *   "author": { user data },
   *   "createdAt": "2024-01-31T...",
   *   ...
   * }
   * 
   * Author is automatically set from JWT token
   * 
   * @param createPostDto - Post data
   * @param currentUser - Authenticated user (author)
   * @returns Created post
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.postsService.create(createPostDto, currentUser);
  }

  /**
   * Update post
   * 
   * Route: PUT /posts/:id
   * Protected: Requires valid JWT token
   * Authorization: Only post author can update
   * 
   * Request body (all fields optional):
   * {
   *   "title": "Updated Title",
   *   "content": "Updated content...",
   *   "imageUrl": "https://..."
   * }
   * 
   * @param id - Post ID
   * @param updatePostDto - Fields to update
   * @param currentUser - Authenticated user
   * @returns Updated post
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.postsService.update(id, updatePostDto, currentUser);
  }

  /**
   * Delete post
   * 
   * Route: DELETE /posts/:id
   * Protected: Requires valid JWT token
   * Authorization: Only post author can delete
   * 
   * Cascade: All comments on this post are deleted
   * 
   * @param id - Post ID
   * @param currentUser - Authenticated user
   * @returns Success message
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.postsService.delete(id, currentUser);
  }

  /**
   * Like a post
   * 
   * Route: POST /posts/:id/like
   * Protected: Requires valid JWT token
   * 
   * Increments post's likesCount
   * 
   * @param id - Post ID
   * @returns Updated post with new like count
   */
  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async like(@Param('id') id: string) {
    return this.postsService.toggleLike(id, true);
  }

  /**
   * Unlike a post
   * 
   * Route: POST /posts/:id/unlike
   * Protected: Requires valid JWT token
   * 
   * Decrements post's likesCount
   * 
   * @param id - Post ID
   * @returns Updated post with new like count
   */
  @Post(':id/unlike')
  @UseGuards(JwtAuthGuard)
  async unlike(@Param('id') id: string) {
    return this.postsService.toggleLike(id, false);
  }
}
