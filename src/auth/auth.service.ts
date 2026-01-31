import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../users/dto/login.dto';

/**
 * AUTH SERVICE
 * 
 * Handles authentication logic:
 * 1. Login - Verify credentials and return JWT token
 * 2. Validate user - Check if user exists with password
 * 
 * Key Concepts:
 * - Password Hashing: Never store plain passwords!
 *   bcrypt hashes passwords irreversibly
 * - JWT Token: After login, return token instead of storing session
 *   Token is stateless - no server-side session needed
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validate user credentials
   * 
   * Called during login:
   * 1. Find user by email
   * 2. Compare provided password with hashed password in database
   * 3. Return user if valid, null if invalid
   * 
   * @param email - User email
   * @param password - Plain password to verify
   * @returns User object or null
   */
  async validateUser(email: string, password: string) {
    // Find user by email
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    // Compare passwords using bcrypt
    // bcrypt.compare(plainPassword, hashedPassword)
    // Returns true if passwords match
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Return user without password field
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }

    return null;
  }

  /**
   * Login and return JWT token
   * 
   * Process:
   * 1. Validate credentials
   * 2. Create JWT token with user data
   * 3. Return token to client
   * 
   * Client stores token and sends with each request:
   * Authorization: Bearer <token>
   * 
   * @param loginDto - Email and password
   * @returns Object with access_token
   */
  async login(loginDto: LoginDto) {
    // Validate user credentials
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Create JWT payload
    const payload = {
      email: user.email,
      sub: user.id, // 'sub' = subject (user ID)
    };

    // Sign and return token
    // token expires in 24 hours (24h)
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '24h',
        secret: 'your-secret-key-change-in-production',
      }),
      user,
    };
  }
}
