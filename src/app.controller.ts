import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * APP CONTROLLER - ROOT CONTROLLER
 * 
 * Handles root-level HTTP requests.
 * Example: GET / returns API information
 * 
 * This is the main entry point for API requests.
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Health check endpoint
   * 
   * Route: GET /
   * 
   * Returns:
   * {
   *   "message": "Welcome to Blog API",
   *   "version": "1.0.0",
   *   "status": "running"
   * }
   * 
   * Usage:
   * - Check if server is running
   * - Verify API is responding
   */
  @Get()
  getHello() {
    return this.appService.getHello();
  }

  /**
   * API Status endpoint
   * 
   * Route: GET /api/status
   * 
   * Returns API information and endpoints
   */
  @Get('api/status')
  getStatus() {
    return this.appService.getApiStatus();
  }
}

