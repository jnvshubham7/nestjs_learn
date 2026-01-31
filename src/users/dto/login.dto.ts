import { IsString, IsEmail, MinLength } from 'class-validator';

/**
 * LOGIN DTO
 * 
 * Simple DTO for login requests containing only
 * the minimum required fields: email/username and password.
 */
export class LoginDto {
  /**
   * User email or username for authentication
   */
  @IsEmail({}, { message: 'Please provide valid email' })
  email: string;

  /**
   * User password
   * Must match hashed password in database
   */
  @IsString()
  @MinLength(6)
  password: string;
}
