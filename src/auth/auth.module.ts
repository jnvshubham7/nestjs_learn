import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from '../common/strategies/jwt.strategy';

/**
 * AUTH MODULE
 * 
 * Concept: Modules are containers for related features.
 * This module handles authentication (login, register, JWT).
 * 
 * Module Structure:
 * - imports: Dependencies from other modules
 * - controllers: Handle HTTP requests
 * - providers: Services with business logic
 * - exports: What other modules can use
 * 
 * Dependencies:
 * - UsersModule: For user creation and lookup
 * - PassportModule: Authentication middleware
 * - JwtModule: JWT token creation
 */
@Module({
  // Import modules needed by this module
  imports: [
    // Passport authentication middleware
    PassportModule,
    
    // JWT Module for token generation
    // register() configures module with options
    JwtModule.register({
      secret: 'your-secret-key-change-in-production',
      signOptions: { expiresIn: '24h' },
    }),
    
    // Import UsersModule to use UsersService
    UsersModule,
  ],
  
  // Controllers that handle routes in this module
  controllers: [AuthController],
  
  // Providers (services) in this module
  providers: [AuthService, JwtStrategy],
  
  // Export services so other modules can use them
  exports: [AuthService],
})
export class AuthModule {}
