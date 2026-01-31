import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsUrl,
} from 'class-validator';

/**
 * CREATE USER DTO
 * 
 * Concept: Data Transfer Objects (DTOs) validate and transform
 * incoming request data before it reaches your service.
 * 
 * Benefits:
 * 1. Type Safety - TypeScript catches type mismatches
 * 2. Validation - Ensures data meets requirements
 * 3. API Documentation - Clear contract for API consumers
 * 4. Security - Reject malformed/malicious data early
 * 
 * @IsString() - Must be a string
 * @IsEmail() - Must be valid email format
 * @MinLength() - Must have minimum characters
 * @IsOptional() - This field is optional (can be omitted)
 */
export class CreateUserDto {
  /**
   * Username for login
   * - Must be between 3-20 characters
   * - Used as unique identifier
   */
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @MaxLength(20, { message: 'Username must not exceed 20 characters' })
  username: string;

  /**
   * Email address
   * - Must be valid email format
   * - Unique in database
   */
  @IsEmail({}, { message: 'Please provide valid email address' })
  email: string;

  /**
   * Password
   * - Must be at least 6 characters
   * - Will be hashed before storing
   */
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  /**
   * User's full name
   */
  @IsString()
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  fullName: string;

  /**
   * User bio/description (optional)
   */
  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Bio must not exceed 500 characters' })
  bio?: string;

  /**
   * Avatar image URL (optional)
   */
  @IsUrl({}, { message: 'Avatar URL must be a valid URL' })
  @IsOptional()
  avatarUrl?: string;
}
