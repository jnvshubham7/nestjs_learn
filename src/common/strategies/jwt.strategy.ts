import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * JWT STRATEGY
 * 
 * Concept: Passport.js is a popular authentication middleware.
 * A "Strategy" is a method of authentication (JWT, OAuth, Local, etc.)
 * 
 * How it works:
 * 1. Client sends JWT token in Authorization header
 * 2. Passport extracts the token using ExtractJwt.fromAuthHeaderAsBearerToken()
 * 3. Verifies token signature using JWT_SECRET
 * 4. Calls validate() with decoded token payload
 * 5. Returns user data if valid, rejects if invalid
 * 
 * Key Points:
 * - JWT_SECRET must match the secret used to sign tokens
 * - payload.sub contains user ID
 * - validate() must return user object or throw exception
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extract token from: Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // Token secret - in production, use environment variable
      secretOrKey: 'your-secret-key-change-in-production',
      
      // Algorithm used for signing
      algorithms: ['HS256'],
    });
  }

  /**
   * Validate and extract user data from JWT payload
   * 
   * @param payload - Decoded JWT token
   * @returns User data or throws exception
   * 
   * The payload contains data encoded when token was created.
   * Typically: { sub: userId, email: 'user@example.com' }
   */
  validate(payload: any) {
    // This object is attached to request.user
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
