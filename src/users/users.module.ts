import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

/**
 * USERS MODULE
 * 
 * Concept: Feature module for user management.
 * 
 * Key Concepts:
 * - TypeOrmModule.forFeature([User]) - Register User entity
 *   This tells TypeORM to manage User table
 * - Services can now inject UserRepository
 * 
 * Exports:
 * - UsersService is exported so AuthModule can import it
 */
@Module({
  // Register User entity with TypeORM
  // This allows UsersService to use UserRepository
  imports: [TypeOrmModule.forFeature([User])],
  
  // Controllers for /users routes
  controllers: [UsersController],
  
  // Service for business logic
  providers: [UsersService],
  
  // Export so other modules (like AuthModule) can use UsersService
  exports: [UsersService],
})
export class UsersModule {}
