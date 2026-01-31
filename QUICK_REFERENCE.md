# Quick Reference Guide

Quick lookups for common concepts and code patterns.

## 🎯 Start Here

**First Time?**
1. Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Installation & running
2. Read [LEARNING_GUIDE.md](./LEARNING_GUIDE.md) - Core concepts
3. Run `npm run start:dev`
4. Test API endpoints in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 📚 Directory Guide

| File/Folder | Purpose | Read When |
|-------------|---------|-----------|
| `SETUP_GUIDE.md` | How to install & run | First! |
| `LEARNING_GUIDE.md` | What is NestJS & concepts | Learning the framework |
| `ARCHITECTURE.md` | System design & patterns | Understanding big picture |
| `API_DOCUMENTATION.md` | All API endpoints | Testing API |
| `src/main.ts` | App entry point | Understanding startup |
| `src/app.module.ts` | Root module | Understanding imports |
| `src/users/` | User management | CRUD examples |
| `src/posts/` | Post management | Relationships |
| `src/comments/` | Comment management | Nested routes |
| `src/auth/` | Authentication | JWT & security |
| `src/common/` | Shared code | Guards & decorators |

---

## 🚀 Common Tasks

### Run Application
```bash
npm run start:dev
```

### Test API Endpoint
```bash
curl -X GET http://localhost:3000/posts
```

### Add New Field to User
1. Edit `src/users/entities/user.entity.ts`
2. Add `@Column()` property
3. Restart app - database auto-updates

### Add New API Endpoint
1. Add method to controller
2. Add method to service
3. Define route with `@Get()`, `@Post()`, etc.

### Change Port
```bash
PORT=4000 npm run start:dev
```

### Run Tests
```bash
npm test
```

---

## 📝 Code Snippets

### Creating a DTO
```typescript
import { IsString, MinLength, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;
}
```

### Creating an Entity
```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;
}
```

### Creating a Service
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.usersRepository.find();
  }
}
```

### Creating a Controller
```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

### Creating a Module
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

### Protecting a Route
```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './entities/user.entity';

@Post()
@UseGuards(JwtAuthGuard)
create(
  @Body() dto: CreatePostDto,
  @CurrentUser() user: User,
) {
  return this.postsService.create(dto, user);
}
```

---

## 🔍 Debugging Tips

### Check if server is running
```bash
curl http://localhost:3000
```

### View database file
- Open `blog.db` with SQLite Browser or DBeaver

### Enable SQL logging
In `src/database/database.module.ts`:
```typescript
logging: true,  // See all SQL queries in terminal
```

### Print request/response
```typescript
console.log('Request:', request.body);
console.log('Response:', result);
```

### Check JWT token
Paste token at https://jwt.io to decode

---

## 🛑 Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot find module` | Missing npm packages | `npm install` |
| `Port 3000 in use` | Another app using port | `PORT=4000 npm run start:dev` |
| `ENOENT: blog.db` | Database corrupted | Delete `blog.db`, restart app |
| `401 Unauthorized` | Missing JWT token | Add `Authorization: Bearer <token>` |
| `403 Forbidden` | Not authorized to action | Only owners can edit their content |
| `404 Not Found` | Resource doesn't exist | Check ID is correct |
| `Validation Error` | Invalid request data | Check DTO requirements |

---

## 📊 Entity Relationships

### One-to-Many
```
One User ──→ Many Posts

@OneToMany(() => Post, post => post.author)
posts: Post[];

@ManyToOne(() => User, user => user.posts)
author: User;
```

### Many-to-One
```
Many Comments ──→ One Post

@ManyToOne(() => Post, post => post.comments)
post: Post;

@OneToMany(() => Comment, comment => comment.post)
comments: Comment[];
```

---

## 🔐 Security Quick Tips

1. **Never commit secrets** to Git
2. **Hash passwords** with bcrypt (not plain text)
3. **Validate all inputs** with DTOs
4. **Check user owns resource** before edit/delete
5. **Use HTTPS** in production
6. **Rotate JWT secret** regularly
7. **Set JWT expiry** (24h is default)

---

## 📱 Testing with Postman/Thunder Client

### Step 1: Register
```
POST http://localhost:3000/auth/register
Body:
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

### Step 2: Login
```
POST http://localhost:3000/auth/login
Body:
{
  "email": "john@example.com",
  "password": "password123"
}
Response: Copy "access_token"
```

### Step 3: Use Token
```
GET http://localhost:3000/users/profile/me
Header: Authorization: Bearer <paste_token_here>
```

---

## 🌳 File Tree (Important Files)

```
src/
├── main.ts                           ← START HERE
├── app.module.ts                     ← Imports all modules
│
├── auth/
│   ├── auth.controller.ts            ← /auth/login, /auth/register
│   ├── auth.service.ts               ← Login logic
│   └── auth.module.ts
│
├── users/
│   ├── users.controller.ts           ← GET /users, etc.
│   ├── users.service.ts              ← Database operations
│   ├── entities/user.entity.ts       ← Database schema
│   ├── dto/create-user.dto.ts        ← Validation
│   └── users.module.ts
│
├── posts/
│   ├── posts.controller.ts           ← Routes for posts
│   ├── posts.service.ts              ← Business logic
│   ├── entities/post.entity.ts       ← Database schema
│   └── posts.module.ts
│
├── comments/
│   ├── comments.controller.ts        ← Comment routes
│   ├── comments.service.ts           ← Comment logic
│   └── comments.module.ts
│
└── common/
    ├── decorators/current-user.decorator.ts
    ├── guards/jwt.guard.ts           ← Protect routes
    └── strategies/jwt.strategy.ts    ← Verify tokens
```

---

## 🎓 Learning Checklist

- [ ] Read SETUP_GUIDE.md
- [ ] Run `npm install`
- [ ] Run `npm run start:dev`
- [ ] Register a user (POST /auth/register)
- [ ] Login (POST /auth/login)
- [ ] Create a post (POST /posts)
- [ ] Read LEARNING_GUIDE.md
- [ ] Read ARCHITECTURE.md
- [ ] Explore code files
- [ ] Understand DTOs
- [ ] Understand Services
- [ ] Understand Controllers
- [ ] Understand Modules
- [ ] Try modifying code
- [ ] Add new field to entity
- [ ] Create new endpoint
- [ ] Read tests
- [ ] Write your own tests

---

## 🔗 Useful Links

- **NestJS Docs:** https://docs.nestjs.com
- **TypeORM Docs:** https://typeorm.io
- **JWT Intro:** https://jwt.io
- **REST API Guide:** https://restfulapi.net
- **TypeScript Handbook:** https://www.typescriptlang.org/docs

---

## 💬 Quick Concepts

**Entity:** Database table structure
**DTO:** Input/output data with validation
**Service:** Business logic layer
**Controller:** HTTP request handler
**Module:** Logical feature container
**Guard:** Authentication/authorization check
**Decorator:** Function that adds metadata
**Repository:** Database query interface
**Middleware:** Request processing pipeline

---

**Keep this guide open while coding! 🚀**
