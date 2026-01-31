import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * CURRENT USER DECORATOR
 * 
 * Concept: Custom decorators extract values from requests.
 * This decorator simplifies getting the authenticated user.
 * 
 * Normal way (verbose):
 * @Get('/profile')
 * getProfile(@Request() req) {
 *   const user = req.user;
 * }
 * 
 * Better way (using our decorator):
 * @Get('/profile')
 * getProfile(@CurrentUser() user: User) {
 *   // user is already extracted!
 * }
 * 
 * How it works:
 * 1. @createParamDecorator registers a parameter decorator
 * 2. ExecutionContext provides access to request object
 * 3. We extract user from request.user (set by JWT guard)
 * 4. Returns the user object directly to the handler
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // Get the request object from execution context
    const request = ctx.switchToHttp().getRequest();
    
    // Return the user object (set by JwtAuthGuard)
    // This will only exist if JwtAuthGuard was applied
    return request.user;
  },
);
