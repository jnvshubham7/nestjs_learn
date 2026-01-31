# Setup & Running Guide

Complete step-by-step guide to set up and run the NestJS blog backend.

## 📋 Prerequisites

### Required:
- **Node.js** v18 or higher
  - Download: https://nodejs.org
  - Verify: `node --version`
- **npm** (comes with Node.js)
  - Verify: `npm --version`

### Optional (for better experience):
- **Git** (version control)
- **VSCode** (code editor)
- **Postman** or **Thunder Client** (API testing)

---

## 🚀 Installation Steps

### Step 1: Navigate to Project
```bash
cd d:\interview-practice\nestjs_learn
```

### Step 2: Install Dependencies
```bash
npm install
```

**What this does:**
- Downloads all packages from package.json
- Creates `node_modules` folder (~400MB)
- Creates `package-lock.json` (lock file for versions)

**This may take 2-5 minutes** ☕

### Step 3: Verify Installation
```bash
npm list @nestjs/core
```

Should show: `@nestjs/core@11.0.1` (or similar version)

---

## 🏃 Running the Application

### Development Mode (Recommended for Learning)

```bash
npm run start:dev
```

**What this does:**
- Starts the server on port 3000
- Watches files for changes
- Auto-restarts on file save
- Shows logs in terminal

**Expected Output:**
```
[Nest] 12345   - 01/31/2024, 10:00:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345   - 01/31/2024, 10:00:00 AM     LOG [InstanceLoader] TypeOrmModule dependencies initialized
...
🚀 Application running on: http://localhost:3000
```

### Other Run Commands

```bash
# Production mode (no watch, no logs)
npm run start:prod

# Debug mode (with debugger)
npm run start:debug

# Just build (no run)
npm run build
```

---

## ✅ Test the API

### Option 1: Using cURL (Command Line)

#### 1. Register a User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "testuser",
  "email": "test@example.com",
  "fullName": "Test User",
  "createdAt": "2024-01-31T10:00:00.000Z"
}
```

#### 2. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

**Save the `access_token` for next steps!**

#### 3. Create a Post
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My First Post",
    "content": "This is my first blog post with some awesome content!"
  }'
```

#### 4. Get All Posts
```bash
curl -X GET http://localhost:3000/posts
```

---

### Option 2: Using Postman (Recommended)

#### 1. Download Postman
- Website: https://www.postman.com
- Or use Thunder Client extension in VSCode

#### 2. Create Requests

**Register Request:**
```
Method: POST
URL: http://localhost:3000/auth/register
Body (JSON):
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Login Request:**
```
Method: POST
URL: http://localhost:3000/auth/login
Body (JSON):
{
  "email": "john@example.com",
  "password": "password123"
}
```

After login, copy the `access_token` from response.

**Create Post Request:**
```
Method: POST
URL: http://localhost:3000/posts
Headers:
  Content-Type: application/json
  Authorization: Bearer <paste_your_token_here>
Body (JSON):
{
  "title": "My First Post",
  "content": "Amazing content here..."
}
```

---

### Option 3: Using Thunder Client (VSCode Extension)

1. Install "Thunder Client" extension
2. Open Thunder Client in VSCode
3. Create requests same as Postman
4. Easier to use within VSCode!

---

## 📁 File Structure After Setup

```
nestjs_learn/
├── src/
│   ├── main.ts                 ← Application entry point
│   ├── app.module.ts           ← Root module
│   ├── app.controller.ts       ← Root controller
│   ├── app.service.ts          ← Root service
│   │
│   ├── auth/                   ← Authentication
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   │
│   ├── users/                  ← User management
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       ├── login.dto.ts
│   │       └── update-user.dto.ts
│   │
│   ├── posts/                  ← Post management
│   │   ├── posts.controller.ts
│   │   ├── posts.service.ts
│   │   ├── posts.module.ts
│   │   ├── entities/
│   │   │   └── post.entity.ts
│   │   └── dto/
│   │       ├── create-post.dto.ts
│   │       └── update-post.dto.ts
│   │
│   ├── comments/               ← Comment management
│   │   ├── comments.controller.ts
│   │   ├── comments.service.ts
│   │   ├── comments.module.ts
│   │   ├── entities/
│   │   │   └── comment.entity.ts
│   │   └── dto/
│   │       └── create-comment.dto.ts
│   │
│   ├── common/                 ← Shared utilities
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   ├── guards/
│   │   │   └── jwt.guard.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   │
│   └── database/
│       └── database.module.ts  ← Database configuration
│
├── test/                       ← Tests
│   └── app.e2e-spec.ts
│
├── node_modules/              ← Dependencies (created by npm install)
├── dist/                       ← Compiled JavaScript (created by npm run build)
│
├── package.json               ← Dependencies list
├── tsconfig.json              ← TypeScript configuration
├── nest-cli.json              ← NestJS CLI configuration
│
├── blog.db                    ← SQLite database file (created on first run)
│
├── LEARNING_GUIDE.md          ← Learning concepts
├── ARCHITECTURE.md            ← System architecture
├── API_DOCUMENTATION.md       ← API reference
└── README.md                  ← Project info
```

---

## 🔧 Troubleshooting

### Error: "Cannot find module '@nestjs/core'"
```bash
# Solution: Install dependencies
npm install
```

### Error: "Port 3000 already in use"
```bash
# Option 1: Use different port
PORT=4000 npm run start:dev

# Option 2: Kill process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# macOS/Linux:
lsof -i :3000
kill -9 <PID_NUMBER>
```

### Error: "ENOENT: no such file or directory"
```bash
# Make sure you're in the right directory
cd d:\interview-practice\nestjs_learn
```

### Database file corrupted
```bash
# Delete and recreate database
rm blog.db

# Or on Windows
del blog.db

# Restart application - new database will be created
npm run start:dev
```

---

## 📝 Common npm Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run start` | Run production |
| `npm run start:dev` | Run development (watch files) |
| `npm run build` | Build for production |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run lint` | Check code style |
| `npm run format` | Auto-format code |

---

## 🧪 Testing Your API

### Full Test Flow:

1. **Register User**
   ```bash
   POST /auth/register
   {
     "username": "john_doe",
     "email": "john@example.com",
     "password": "password123",
     "fullName": "John Doe"
   }
   ```

2. **Login**
   ```bash
   POST /auth/login
   {
     "email": "john@example.com",
     "password": "password123"
   }
   # Copy the access_token
   ```

3. **Create Post**
   ```bash
   POST /posts
   Headers: Authorization: Bearer <token>
   {
     "title": "My First Post",
     "content": "This is the content of my post!"
   }
   ```

4. **Get All Posts**
   ```bash
   GET /posts
   ```

5. **Get Single Post**
   ```bash
   GET /posts/<post_id>
   # Replace <post_id> with ID from step 3
   ```

6. **Add Comment**
   ```bash
   POST /posts/<post_id>/comments
   Headers: Authorization: Bearer <token>
   {
     "content": "Great post!"
   }
   ```

7. **Like Post**
   ```bash
   POST /posts/<post_id>/like
   Headers: Authorization: Bearer <token>
   ```

---

## 📊 Monitor Your Application

### In Terminal:
- Watch the logs as requests come in
- See SQL queries executed (if logging enabled)
- Spot errors immediately

### Database File:
- Located at: `blog.db`
- SQLite file-based database
- Can view with SQLite GUI tools (DBeaver, SQLite Browser)

### API Testing:
- Use Postman/Thunder Client to test
- Check response times
- Verify response data

---

## 🎯 Learning Workflow

### Day 1-2: Setup & Basics
```
1. npm install dependencies
2. npm run start:dev to run server
3. Register and login user
4. Understand JWT token
```

### Day 3-4: Create Features
```
1. Create posts
2. Add comments
3. Like posts
4. Read code - understand flow
```

### Day 5-6: Explore Code
```
1. Read entity files - understand database schema
2. Read DTOs - understand validation
3. Read services - understand business logic
4. Read controllers - understand HTTP routing
```

### Day 7+: Build & Modify
```
1. Add new field to user
2. Create new entity (e.g., Tags)
3. Add new endpoint
4. Write tests
```

---

## 🌐 Accessing the API

### When running locally:
- **Base URL:** `http://localhost:3000`
- **API Docs:** `/API_DOCUMENTATION.md` (in repo)
- **Health Check:** `GET http://localhost:3000`

### Example request:
```bash
curl http://localhost:3000
```

**Response:**
```json
{
  "message": "Welcome to the Blog API",
  "version": "1.0.0",
  "status": "running"
}
```

---

## 🚢 Deploying (Future)

When you're ready to deploy:
1. Change database to PostgreSQL
2. Add environment variables (.env file)
3. Run `npm run build`
4. Deploy to Heroku/Railway/AWS
5. Update JWT secret in production

---

## 🆘 Getting Help

1. **Error in terminal?**
   - Read error message carefully
   - Check file permissions
   - Check port availability

2. **API not working?**
   - Check JWT token is included
   - Check request format matches DTO
   - Check user exists in database

3. **Stuck?**
   - Re-read LEARNING_GUIDE.md
   - Check ARCHITECTURE.md for concepts
   - Look at API_DOCUMENTATION.md for examples

4. **Need more info?**
   - Read code comments (every file is documented!)
   - Check NestJS docs: https://docs.nestjs.com

---

## ✨ Next Steps

1. ✅ Install dependencies
2. ✅ Run the application
3. ✅ Test with API requests
4. ✅ Read the learning guide
5. ✅ Explore the code
6. ✅ Modify and experiment
7. ✅ Build your own features!

---

**Happy Learning! Happy Coding! 🚀**
