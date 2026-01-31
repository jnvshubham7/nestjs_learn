# NestJS Learning Backend - Complete Guide

## 📚 What We're Building

A **Social Media/Blog Platform Backend** with the following features:
- User authentication (JWT-based)
- User management
- Posts creation and management
- Comments on posts
- Like functionality
- Database persistence (SQLite for learning)

## 🎯 Core NestJS Concepts You'll Learn

### 1. **Modules** 📦
- Logical containers for related features
- Imports, exports, and dependency injection
- See: `app.module.ts`, `users.module.ts`, `posts.module.ts`, etc.

### 2. **Controllers** 🎮
- Handle HTTP requests (GET, POST, PUT, DELETE)
- Define routes and endpoints
- See: `users.controller.ts`, `posts.controller.ts`

### 3. **Services** ⚙️
- Business logic and data operations
- Dependency injection
- Database interactions
- See: `users.service.ts`, `posts.service.ts`

### 4. **Entities** 📊
- Database models using TypeORM
- Define tables and relationships
- See: `entities/user.entity.ts`, `entities/post.entity.ts`

### 5. **DTOs (Data Transfer Objects)** 📮
- Validate and transform data
- Type safety for requests/responses
- See: `dto/create-user.dto.ts`, `dto/create-post.dto.ts`

### 6. **Decorators** ✨
- @Module, @Controller, @Injectable
- @Get, @Post, @Body, @Param, @Query
- Custom decorators for authentication

### 7. **Middleware & Guards** 🔐
- Authentication (JWT)
- Authorization checks
- Request validation

### 8. **Database Integration** 💾
- TypeORM for ORM
- SQLite for lightweight database
- Relationships (One-to-Many, Many-to-One)

---

## 📂 Project Structure

```
src/
├── app.module.ts              # Root module
├── app.controller.ts          # Root controller
├── app.service.ts             # Root service
├── main.ts                    # Application entry point
│
├── common/
│   ├── decorators/
│   │   └── current-user.decorator.ts
│   ├── guards/
│   │   └── jwt.guard.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   └── interceptors/
│       └── response.interceptor.ts
│
├── database/
│   ├── migrations/
│   └── database.module.ts
│
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   ├── login.dto.ts
│   │   └── update-user.dto.ts
│   ├── entities/
│   │   └── user.entity.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
│
├── posts/
│   ├── dto/
│   │   ├── create-post.dto.ts
│   │   └── update-post.dto.ts
│   ├── entities/
│   │   └── post.entity.ts
│   ├── posts.controller.ts
│   ├── posts.service.ts
│   └── posts.module.ts
│
├── comments/
│   ├── dto/
│   │   └── create-comment.dto.ts
│   ├── entities/
│   │   └── comment.entity.ts
│   ├── comments.controller.ts
│   ├── comments.service.ts
│   └── comments.module.ts
│
└── auth/
    ├── auth.service.ts
    ├── auth.controller.ts
    └── auth.module.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Basic TypeScript knowledge

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Run tests
npm test

# Build for production
npm run build
```

---

## 📝 API Endpoints Overview

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

### Users
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user profile
- `DELETE /users/:id` - Delete user

### Posts
- `GET /posts` - Get all posts with pagination
- `GET /posts/:id` - Get single post with comments
- `POST /posts` - Create new post (authenticated)
- `PUT /posts/:id` - Update post (owner only)
- `DELETE /posts/:id` - Delete post (owner only)
- `POST /posts/:id/like` - Like a post

### Comments
- `GET /posts/:postId/comments` - Get all comments for post
- `POST /posts/:postId/comments` - Add comment (authenticated)
- `PUT /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment

---

## 🔑 Key Learnings by File

| File | Concept | Why It's Important |
|------|---------|-------------------|
| `main.ts` | Application Bootstrap | Entry point of your app |
| `app.module.ts` | Module Organization | How to structure imports |
| `*.controller.ts` | HTTP Routing | How requests are handled |
| `*.service.ts` | Business Logic | Where data operations happen |
| `*.entity.ts` | Database Schema | How data is structured |
| `*.dto.ts` | Data Validation | Type safety for API |
| `jwt.strategy.ts` | Authentication | How to secure endpoints |
| `jwt.guard.ts` | Authorization | How to protect routes |

---

## 💡 Important NestJS Principles

### 1. **Dependency Injection (DI)**
```typescript
// Instead of creating instances manually:
// const service = new UserService();

// NestJS handles it automatically:
constructor(private userService: UserService) {}
```

### 2. **Modules Encapsulation**
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([User])],  // Import entities
  controllers: [UsersController],                 // Handle routes
  providers: [UsersService],                      // Business logic
  exports: [UsersService],                        // Share with other modules
})
```

### 3. **Decorators Pattern**
```typescript
@Get('/posts')                    // Route decorator
@UseGuards(JwtAuthGuard)         // Security decorator
getAll(@Query('page') page: number) {  // Parameter decorators
  return this.postsService.findAll(page);
}
```

### 4. **Lifecycle Hooks**
- `OnInit` - After module initialization
- `OnDestroy` - Before module destruction

---

## 🔐 Security Features Included

1. **JWT Authentication** - Token-based auth
2. **Password Hashing** - Using bcrypt
3. **Guards & Decorators** - Protect routes
4. **DTOs Validation** - Input validation

---

## 🧪 Testing

The project includes examples for:
- Unit tests (.spec.ts files)
- E2E tests (test/ directory)

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e
```

---

## 📚 Resources for Learning

- [NestJS Official Docs](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [JWT Authentication](https://jwt.io)
- [Passport.js](http://www.passportjs.org)

---

## 🎓 Learning Path

1. **Day 1-2**: Understand modules, controllers, services
2. **Day 3-4**: Learn database integration with TypeORM
3. **Day 5**: Implement authentication with JWT
4. **Day 6-7**: Add validation with DTOs
5. **Day 8+**: Write tests and optimize

---

## 💬 Common Errors & Solutions

### "Cannot find module"
- Run `npm install`
- Check import paths

### "Dependency not found"
- Add provider to module imports
- Check @Module decorators

### "Port already in use"
- Change PORT in environment
- Kill process using port

---

**Happy Learning! 🚀**
