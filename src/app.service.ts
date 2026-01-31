import { Injectable } from '@nestjs/common';

/**
 * APP SERVICE - ROOT SERVICE
 * 
 * Contains application-level business logic.
 * This is a simple example service.
 */
@Injectable()
export class AppService {
  /**
   * Simple hello message
   */
  getHello() {
    return {
      message: 'Welcome to the Blog API',
      version: '1.0.0',
      status: 'running',
    };
  }

  /**
   * Return API information and available endpoints
   */
  getApiStatus() {
    return {
      status: 'active',
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: {
          register: 'POST /auth/register',
          login: 'POST /auth/login',
        },
        users: {
          listAll: 'GET /users',
          getById: 'GET /users/:id',
          getCurrentUser: 'GET /users/profile/me',
          update: 'PUT /users/:id',
          delete: 'DELETE /users/:id',
        },
        posts: {
          listAll: 'GET /posts',
          getById: 'GET /posts/:id',
          create: 'POST /posts',
          update: 'PUT /posts/:id',
          delete: 'DELETE /posts/:id',
          like: 'POST /posts/:id/like',
          unlike: 'POST /posts/:id/unlike',
        },
        comments: {
          getByPost: 'GET /posts/:postId/comments',
          create: 'POST /posts/:postId/comments',
          delete: 'DELETE /comments/:id',
        },
      },
      documentation: {
        learning_guide: '/LEARNING_GUIDE.md',
        api_docs: '/docs',
      },
    };
  }
}
