import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

/**
 * USERS SERVICE
 * 
 * Concept: Services contain business logic and database operations.
 * They're where the "magic" happens - validations, transformations, etc.
 * 
 * Key Points:
 * - @Injectable() makes it available for dependency injection
 * - @InjectRepository(User) injects the User repository
 * - All database operations go here, not in controller
 * - Services are reusable across multiple controllers
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only handles user operations
 * - Open/Closed: Easy to extend without modifying existing code
 * - Dependency Injection: Dependencies are injected, not created
 */
@Injectable()
export class UsersService {
  constructor(
    // Repository pattern: TypeORM provides CRUD operations
    // This is like a "data access layer"
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Create a new user
   * 
   * Process:
   * 1. Check if user already exists (email/username)
   * 2. Hash password using bcrypt
   * 3. Save user to database
   * 4. Return user without password
   * 
   * Why hash passwords?
   * - If database is breached, passwords are still protected
   * - bcrypt is slow intentionally - prevents brute force attacks
   * 
   * @param createUserDto - User registration data
   * @returns Created user (without password)
   */
  async create(createUserDto: CreateUserDto) {
    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email or username already exists',
      );
    }

    // Hash password with salt rounds = 10
    // Higher rounds = slower = more secure (but slower)
    // Default 10 is good balance
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create new user object
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Save to database
    await this.usersRepository.save(user);

    // Return user without password field
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Find user by email
   * Used during login process
   * 
   * @param email - User email
   * @returns User object or undefined
   */
  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  /**
   * Find user by ID
   * 
   * @param id - User ID
   * @returns User object with posts and comments
   */
  async findById(id: string) {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['posts', 'comments'], // Load related data
    });
  }

  /**
   * Get all users with pagination
   * 
   * Pagination prevents loading entire database into memory:
   * - take: number of items to return
   * - skip: number of items to skip
   * 
   * Example: page=2, pageSize=10
   * - skip = (2-1) * 10 = 10
   * - Returns items 11-20
   * 
   * @param page - Page number (1-indexed)
   * @param pageSize - Items per page
   * @returns Array of users
   */
  async findAll(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    return this.usersRepository.find({
      skip,
      take: pageSize,
      relations: ['posts'],
    });
  }

  /**
   * Update user profile
   * 
   * @param id - User ID to update
   * @param updateUserDto - Fields to update
   * @returns Updated user
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    // Check if new email/username already exists
    if (updateUserDto.email || updateUserDto.username) {
      const existingUser = await this.usersRepository.findOne({
        where: [
          { email: updateUserDto.email },
          { username: updateUserDto.username },
        ],
      });

      // If different user has this email/username, throw error
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(
          'This email or username is already taken',
        );
      }
    }

    // Update and save
    await this.usersRepository.update(id, updateUserDto);

    // Return updated user
    return this.findById(id);
  }

  /**
   * Delete user
   * 
   * Warning: This will cascade delete:
   * - All posts by this user
   * - All comments by this user
   * 
   * @param id - User ID to delete
   */
  async delete(id: string) {
    const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      throw new BadRequestException('User not found');
    }

    return { message: 'User deleted successfully' };
  }
}
