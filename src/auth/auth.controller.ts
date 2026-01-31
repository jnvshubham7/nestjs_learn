import {
  Controller,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login.dto';

/**
 * AUTH CONTROLLER
 * 
 * Handles authentication endpoints:
 * - /auth/register - Create new user account
 * - /auth/login - Login and get JWT token
 * 
 * Key Points:
 * - @Controller('auth') - Base route is /auth
 * - @Post() - Handles POST requests
 * - @Body() - Extracts request body and validates against DTO
 */
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  /**
   * Register new user
   * 
   * Route: POST /auth/register
   * 
   * Request body:
   * {
   *   "username": "john_doe",
   *   "email": "john@example.com",
   *   "password": "secretPassword123",
   *   "fullName": "John Doe",
   *   "bio": "Software developer",
   *   "avatarUrl": "https://..."
   * }
   * 
   * Response:
   * {
   *   "id": "uuid",
   *   "username": "john_doe",
   *   "email": "john@example.com",
   *   ...
   * }
   * 
   * @param createUserDto - Registration data
   * @returns Created user (without password)
   */
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      // Create user (password hashed in service)
      return await this.usersService.create(createUserDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Login user and get JWT token
   * 
   * Route: POST /auth/login
   * 
   * Request body:
   * {
   *   "email": "john@example.com",
   *   "password": "secretPassword123"
   * }
   * 
   * Response:
   * {
   *   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
   *   "user": {
   *     "id": "uuid",
   *     "email": "john@example.com",
   *     ...
   *   }
   * }
   * 
   * How to use token:
   * - Store in localStorage/sessionStorage on frontend
   * - Include in every authenticated request:
   *   Authorization: Bearer <access_token>
   * 
   * @param loginDto - Email and password
   * @returns Object with JWT token and user data
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      // Authenticate and return token
      const result = await this.authService.login(loginDto);
      return result;
    } catch (error) {
      throw new BadRequestException('Invalid email or password');
    }
  }
}
