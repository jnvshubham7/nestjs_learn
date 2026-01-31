# NestJS Architecture & Code Concepts Guide

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Frontend)                     │
│          (React, Vue, Mobile, etc.)                      │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/REST Requests
                         │ (JSON + JWT Token)
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   HTTP Server (Port 3000)                │
│                    (Express Framework)                   │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                     App Module (Root)                    │
├─────────────────────────────────────────────────────────┤
│                    Feature Modules:                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │   Auth   │ │  Users   │ │  Posts   │ │Comments  │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                          │
│  Each Module Has:                                       │
│  • Controller (routes)                                  │
│  • Service (business logic)                             │
│  • Entities (database models)                           │
│  • DTOs (data validation)                               │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│               TypeORM + SQLite Database                 │
│                                                          │
│  ┌────────┐  ┌────────┐  ┌──────────┐                  │
│  │ Users  │  │ Posts  │  │ Comments │                  │
│  │ Table  │  │ Table  │  │ Table    │                  │
│  └────────┘  └────────┘  └──────────┘                  │
│                                                          │
│  (blog.db file on disk)                                │
└─────────────────────────────────────────────────────────┘
```

---

## 🏗️ NestJS Core Concepts

### 1. Modules

**What:** Logical containers for related features

**When to use:**
- Group related controllers, services, and entities
- Organize code by domain (Auth, Users, Posts, etc.)
- Define what's imported and exported

**Example Structure:**
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([User])],  // Dependencies
  controllers: [UsersController],                 // Handle routes
  providers: [UsersService],                      // Business logic
  exports: [UsersService],                        // Share with other modules
})
export class UsersModule {}
```

**Why it matters:**
- **Encapsulation:** Each module is independent
- **Reusability:** Services can be used by other modules
- **Testing:** Easy to test modules in isolation
- **Scalability:** New features = new modules

---

### 2. Controllers

**What:** HTTP request handlers

**Responsible for:**
- Define routes (GET /users, POST /posts, etc.)
- Extract request data (@Body, @Param, @Query)
- Call appropriate service
- Return response

**Example:**
```typescript
@Controller('users')
export class UsersController {
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);  // Call service
  }
}
```

**Key Points:**
- **Thin Logic:** Controllers should be "thin" - minimal logic
- **Delegation:** Pass to service for business logic
- **Request Handling:** Extract and validate data

---

### 3. Services

**What:** Business logic and database operations

**Responsible for:**
- Validate data
- Database queries
- Complex logic
- Return processed data

**Example:**
```typescript
@Injectable()
export class UsersService {
  async findById(id: string) {
    // Business logic here
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
```

**Why separate from controller:**
- **Reusability:** Same service used by different controllers
- **Testing:** Easy to test business logic independently
- **Maintainability:** Logic in one place

---

### 4. Entities

**What:** Database models using TypeORM

**Defines:**
- Table name
- Columns and their types
- Primary keys
- Relationships (OneToMany, ManyToOne)

**Example:**
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];
}
```

**Key Concepts:**
- **Decorators:** @Column, @OneToMany, etc.
- **Relationships:** Define how tables relate
- **Cascade:** Auto-delete related records

---

### 5. DTOs (Data Transfer Objects)

**What:** Validate and transform request data

**Defines:**
- Required fields
- Field types
- Validation rules
- Transformation rules

**Example:**
```typescript
export class CreateUserDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;
}
```

**Benefits:**
- **Type Safety:** Compile-time type checking
- **Runtime Validation:** Reject bad data early
- **Documentation:** API contract clear
- **Security:** Prevent invalid/malicious data

---

### 6. Dependency Injection

**What:** NestJS automatically provides dependencies

**Instead of:**
```typescript
// ❌ BAD: Creating instances manually
export class UserController {
  private usersService = new UsersService();
}
```

**NestJS Way:**
```typescript
// ✅ GOOD: NestJS provides the dependency
export class UserController {
  constructor(private usersService: UsersService) {}
}
```

**Why?**
- **Loose Coupling:** Services are independent
- **Testability:** Easy to inject mock services
- **Flexibility:** Change implementations easily

---

### 7. Decorators

**What:** Special functions that add metadata

**Common Decorators:**

| Decorator | Purpose | Example |
|-----------|---------|---------|
| `@Controller()` | Mark class as controller | `@Controller('users')` |
| `@Get()` | Handle GET request | `@Get(':id')` |
| `@Post()` | Handle POST request | `@Post()` |
| `@Body()` | Extract request body | `@Body() dto: CreateUserDto` |
| `@Param()` | Extract URL parameter | `@Param('id') id: string` |
| `@Query()` | Extract query parameter | `@Query('page') page: number` |
| `@UseGuards()` | Apply authentication guard | `@UseGuards(JwtAuthGuard)` |
| `@Injectable()` | Mark as provider (service) | `@Injectable()` |

---

## 🔐 Authentication Flow

```
1. USER REGISTERS
   ↓
   POST /auth/register
   + username, email, password
   ↓
2. SERVER PROCESSES
   ✓ Validates data (DTO)
   ✓ Checks email not taken
   ✓ Hashes password (bcrypt)
   ✓ Saves to database
   ↓
3. RETURN USER DATA
   (without password)

---

1. USER LOGS IN
   ↓
   POST /auth/login
   + email, password
   ↓
2. SERVER PROCESSES
   ✓ Find user by email
   ✓ Compare password with hash
   ✓ If match: Create JWT token
   ✓ If no match: Error 401
   ↓
3. RETURN TOKEN
   { access_token: "eyJ..." }

---

1. USER MAKES REQUEST
   ↓
   GET /posts
   + Header: Authorization: Bearer <token>
   ↓
2. SERVER VALIDATES
   ✓ Extract token from header
   ✓ Verify token signature
   ✓ Check token not expired
   ✓ Extract user ID from token
   ↓
3. PROCESS REQUEST
   ✓ Load user from database
   ✓ Attach to request.user
   ✓ Call route handler
   ↓
4. RETURN DATA
   (user-specific data)
```

---

## 🔄 Request-Response Cycle

### Example: Creating a Post

```
CLIENT REQUEST:
POST /posts
Authorization: Bearer <token>
{
  "title": "My Post",
  "content": "Content..."
}

    ↓

NEST.JS PROCESSING:

1. VALIDATION
   └─ ValidationPipe validates DTO
      └─ CreatePostDto checks:
         • title: 5-200 chars ✓
         • content: 10+ chars ✓
         • format correct ✓

2. ROUTE MATCHING
   └─ Router finds matching route
      └─ @Post() in PostsController

3. GUARD EXECUTION
   └─ @UseGuards(JwtAuthGuard)
      └─ JwtStrategy validates token
         └─ Extracts user ID
         └─ Loads user from database
         └─ Attaches to request.user

4. CONTROLLER HANDLER
   └─ async create(
        @Body() createPostDto,
        @CurrentUser() user
      ) {
        // Handle request

5. SERVICE EXECUTION
   └─ this.postsService.create()
      └─ Create Post object
      └─ Save to database
      └─ Return created post

6. RESPONSE PREPARATION
   └─ Serialize post object
   └─ Convert to JSON
   └─ Apply status code 201

SERVER RESPONSE:
201 Created
{
  "id": "uuid",
  "title": "My Post",
  "content": "Content...",
  "author": { ... },
  "createdAt": "2024-01-31T..."
}
```

---

## 💾 Database Relationships

### One-to-Many: User → Posts

```
Users Table
┌───────────┐
│ ID        │
│ Username  │
└───────────┘
      │
      │ (One user)
      │
      ├──→ (Many posts)
      │
      ▼
Posts Table
┌──────────────┐
│ ID           │
│ Title        │
│ AuthorID ◄───┼─ Foreign Key
│ Content      │
└──────────────┘
```

**In Code:**
```typescript
// User Entity
@OneToMany(() => Post, post => post.author)
posts: Post[];

// Post Entity
@ManyToOne(() => User, user => user.posts)
author: User;
```

---

### Many-to-Many: Posts ↔ Tags (Example)

```
Posts Table          Tags Table
┌────────┐          ┌────────┐
│ ID     │          │ ID     │
│ Title  │          │ Name   │
└────────┘          └────────┘
    │                   │
    └─────────┬─────────┘
              │
      PostTags Join Table
      ┌──────────────────┐
      │ PostID (FK)      │
      │ TagID (FK)       │
      └──────────────────┘
```

---

## 🛡️ Error Handling

**Common Exceptions:**

```typescript
// Not Found (404)
throw new NotFoundException('User not found');

// Bad Request (400)
throw new BadRequestException('Invalid data');

// Forbidden (403)
throw new ForbiddenException('Not authorized');

// Conflict (409)
throw new ConflictException('Email already exists');

// Unauthorized (401)
throw new UnauthorizedException('Invalid token');
```

---

## 🧪 Testing Patterns

### Unit Test Example (Service)

```typescript
describe('UsersService', () => {
  let service: UsersService;
  let mockRepository;

  beforeEach(() => {
    // Mock the repository
    mockRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    // Inject mocks
    service = new UsersService(mockRepository);
  });

  it('should find user by email', async () => {
    // Arrange
    const mockUser = { id: '1', email: 'test@example.com' };
    mockRepository.findOne.mockResolvedValue(mockUser);

    // Act
    const result = await service.findByEmail('test@example.com');

    // Assert
    expect(result).toEqual(mockUser);
    expect(mockRepository.findOne).toHaveBeenCalled();
  });
});
```

---

## 🚀 Best Practices

### 1. Keep Controllers Thin
```typescript
// ❌ BAD: Business logic in controller
@Post()
async create(@Body() dto: CreatePostDto) {
  const post = new Post();
  post.title = dto.title;
  // ... more logic
}

// ✅ GOOD: Delegate to service
@Post()
async create(@Body() dto: CreatePostDto) {
  return this.postService.create(dto);
}
```

### 2. Use DTOs for Validation
```typescript
// ❌ BAD: Manual validation
if (!email.includes('@')) {
  throw new Error('Invalid email');
}

// ✅ GOOD: DTO handles it
export class CreateUserDto {
  @IsEmail()
  email: string;
}
```

### 3. Handle Errors Gracefully
```typescript
// ❌ BAD: Unhandled promise rejection
async findUser(id: string) {
  return this.repository.findOne(id);
}

// ✅ GOOD: Handle not found
async findUser(id: string) {
  const user = await this.repository.findOne(id);
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
}
```

### 4. Use Meaningful Names
```typescript
// ❌ BAD
async get(id: string) { }

// ✅ GOOD
async findUserById(id: string) { }
async getUserWithPosts(id: string) { }
```

---

## 📈 Scalability Considerations

### Current Setup (Good for Learning)
- SQLite: Lightweight, single file
- Synchronize DB: Auto-create tables
- All in one application

### Production Setup
- PostgreSQL or MySQL: Multi-user, robust
- Migrations: Version control for schema
- Microservices: Split features into services
- Caching: Redis for performance
- Queues: Background jobs

---

## 🔗 Common Patterns in This Project

| Pattern | Files | Purpose |
|---------|-------|---------|
| MVC | Controller + Service | Separate concerns |
| Repository | TypeORM Repository | Database abstraction |
| DTO | create-*.dto.ts | Data validation |
| Guard | jwt.guard.ts | Authentication |
| Decorator | current-user.decorator | Extract user from JWT |
| Module | *.module.ts | Organize features |
| Entity | *.entity.ts | Database schema |

---

## 📚 Learning Progression

1. **Week 1:** Understand modules, controllers, services
2. **Week 2:** Learn database with TypeORM
3. **Week 3:** Implement authentication
4. **Week 4:** Add validation with DTOs
5. **Week 5:** Write tests

---

**Next Steps:** Open the code files and read the comments! 🚀
