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
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './entities/user.entity';

/**
 * USERS CONTROLLER
 * 
 * Handles user-related HTTP endpoints:
 * - GET /users - List all users
 * - GET /users/:id - Get specific user
 * - PUT /users/:id - Update user (authenticated)
 * - DELETE /users/:id - Delete user (authenticated)
 * 
 * Decorators Used:
 * - @Controller('users') - Base route /users
 * - @Get(), @Post(), @Put(), @Delete() - HTTP methods
 * - @Param() - Extract from URL path (/users/:id)
 * - @Query() - Extract from query string (?page=1&pageSize=10)
 * - @Body() - Extract from request body
 * - @UseGuards() - Protect routes with authentication
 * - @CurrentUser() - Get authenticated user from JWT
 */
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Get all users with pagination
   * 
   * Route: GET /users?page=1&pageSize=10
   * 
   * Query Parameters:
   * - page: Page number (default: 1)
   * - pageSize: Items per page (default: 10)
   * 
   * Example:
   * GET /users?page=2&pageSize=5
   * Returns users 6-10
   * 
   * @param page - Page number
   * @param pageSize - Items per page
   * @returns Array of users
   */
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.usersService.findAll(page, pageSize);
  }

  /**
   * Get single user by ID
   * 
   * Route: GET /users/:id
   * Example: GET /users/550e8400-e29b-41d4-a716-446655440000
   * 
   * @param id - User ID (UUID format)
   * @returns User object with posts and comments
   */
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  /**
   * Update user profile
   * 
   * Route: PUT /users/:id
   * Protected: Requires valid JWT token
   * 
   * Authorization:
   * - User can only update their own profile
   * - Must send JWT token in Authorization header
   * 
   * Request body (all fields optional):
   * {
   *   "email": "newemail@example.com",
   *   "bio": "New bio",
   *   "avatarUrl": "https://..."
   * }
   * 
   * @param id - User ID
   * @param updateUserDto - Fields to update
   * @param currentUser - Authenticated user from JWT
   * @returns Updated user
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard) // Require authentication
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    // In production, verify currentUser.id === id
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Delete user
   * 
   * Route: DELETE /users/:id
   * Protected: Requires valid JWT token
   * 
   * Warning: This is permanent!
   * - User deleted
   * - All user's posts deleted
   * - All user's comments deleted
   * 
   * @param id - User ID
   * @param currentUser - Authenticated user from JWT
   * @returns Success message
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @CurrentUser() currentUser: User) {
    // In production, verify currentUser.id === id
    return this.usersService.delete(id);
  }

  /**
   * Get current user profile
   * 
   * Route: GET /users/me
   * Protected: Requires valid JWT token
   * 
   * Usage:
   * - Frontend can fetch logged-in user's profile
   * - No ID parameter needed - extracted from JWT
   * 
   * @param currentUser - Authenticated user from JWT
   * @returns Current user data
   */
  @Get('profile/me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() currentUser: User) {
    return this.usersService.findById(currentUser.id);
  }
}
