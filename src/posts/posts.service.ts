import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';

/**
 * POSTS SERVICE
 * 
 * Handles all post-related operations:
 * - Create, read, update, delete posts
 * - Like functionality
 * - Authorization checks (only owner can edit/delete)
 * 
 * Key Concepts:
 * - Authorization: Check if user owns the post before allowing changes
 * - Pagination: Load posts in chunks, not all at once
 * - Relations: Automatically load author and comments with post
 */
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  /**
   * Create a new post
   * 
   * @param createPostDto - Post title, content, image
   * @param author - Authenticated user (set from JWT)
   * @returns Created post with author details
   */
  async create(createPostDto: CreatePostDto, author: User) {
    // Create new post with author information
    const post = this.postsRepository.create({
      ...createPostDto,
      author,
      authorId: author.id,
    });

    // Save to database
    await this.postsRepository.save(post);

    // Return post with author (author is eager loaded)
    return post;
  }

  /**
   * Get all posts with pagination and filtering
   * 
   * Pagination Example:
   * - GET /posts?page=1&pageSize=10
   * - Returns first 10 posts
   * 
   * @param page - Page number (1-indexed)
   * @param pageSize - Number of posts per page
   * @returns Array of posts with authors and comment counts
   */
  async findAll(page: number = 1, pageSize: number = 10) {
    // Calculate how many to skip
    const skip = (page - 1) * pageSize;

    // Get posts with eager-loaded author
    const [posts, total] = await this.postsRepository.findAndCount({
      skip,
      take: pageSize,
      relations: ['author', 'comments'], // Load author and comments
      order: { createdAt: 'DESC' }, // Newest first
    });

    return {
      data: posts,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Get single post by ID
   * 
   * @param id - Post ID
   * @returns Post with author and all comments
   * @throws NotFoundException if post doesn't exist
   */
  async findById(id: string) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'comments', 'comments.author'], // Load nested relations
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  /**
   * Update post
   * 
   * Authorization Check:
   * - Only post author can update
   * - Other users get ForbiddenException
   * 
   * @param id - Post ID
   * @param updatePostDto - Fields to update
   * @param currentUser - Authenticated user
   * @returns Updated post
   * @throws NotFoundException if post not found
   * @throws ForbiddenException if user is not author
   */
  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    currentUser: User,
  ) {
    // Find post
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Check authorization: only author can update
    if (post.author.id !== currentUser.id) {
      throw new ForbiddenException(
        'You are not authorized to update this post',
      );
    }

    // Update post
    await this.postsRepository.update(id, updatePostDto);

    // Return updated post
    return this.findById(id);
  }

  /**
   * Delete post
   * 
   * Authorization Check:
   * - Only post author can delete
   * 
   * Cascade Delete:
   * - All comments on this post are deleted
   * 
   * @param id - Post ID
   * @param currentUser - Authenticated user
   * @throws NotFoundException if post not found
   * @throws ForbiddenException if user is not author
   */
  async delete(id: string, currentUser: User) {
    // Find post
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Check authorization
    if (post.author.id !== currentUser.id) {
      throw new ForbiddenException(
        'You are not authorized to delete this post',
      );
    }

    // Delete post (comments cascade delete)
    await this.postsRepository.delete(id);

    return { message: 'Post deleted successfully' };
  }

  /**
   * Like/Unlike a post
   * 
   * Toggle like functionality:
   * - Increments likesCount when liked
   * - Decrements when unliked
   * 
   * @param id - Post ID
   * @param isLike - true to like, false to unlike
   * @returns Updated post
   */
  async toggleLike(id: string, isLike: boolean) {
    const post = await this.findById(id);

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Update like count
    const newLikeCount = isLike ? post.likesCount + 1 : post.likesCount - 1;

    // Prevent negative likes
    if (newLikeCount < 0) {
      throw new BadRequestException('Cannot unlike post that is not liked');
    }

    await this.postsRepository.update(id, {
      likesCount: newLikeCount,
    });

    return this.findById(id);
  }
}
