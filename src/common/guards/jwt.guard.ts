import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT AUTH GUARD
 * 
 * Concept: Guards are used to protect routes from unauthorized access.
 * They determine if a request should be allowed to proceed.
 * 
 * How it works:
 * 1. Guard is applied to a controller method using @UseGuards()
 * 2. Before method executes, guard checks if user is authenticated
 * 3. If JWT is valid, request.user is populated and route proceeds
 * 4. If JWT is invalid or missing, request is rejected with 401
 * 
 * Usage Example:
 * @Get('/protected')
 * @UseGuards(JwtAuthGuard)
 * getProtectedRoute(@Request() req) {
 *   console.log(req.user.id); // User ID from JWT
 * }
 * 
 * Extends AuthGuard('jwt'):
 * - 'jwt' tells Passport to use the JwtStrategy we defined
 * - AuthGuard handles verification and error handling
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
