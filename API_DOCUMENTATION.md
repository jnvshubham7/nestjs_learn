# Blog API Documentation

Complete API reference for the Blog/Social Media Platform backend.

## Base URL

```
http://localhost:3000
```

## Authentication

Most endpoints require a JWT token. Include it in the request header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### 1. Register User

**Endpoint:** `POST /auth/register`

**Description:** Create a new user account

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "fullName": "John Doe",
  "bio": "Software developer (optional)",
  "avatarUrl": "https://example.com/avatar.jpg (optional)"
}
```

**Response:** `201 Created`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "bio": "Software developer",
  "avatarUrl": "https://example.com/avatar.jpg",
  "createdAt": "2024-01-31T10:00:00Z",
  "updatedAt": "2024-01-31T10:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid data or validation failed
- `409 Conflict` - Email or username already exists

---

### 2. Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and get JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    ...
  }
}
```

**Usage:**
Save the `access_token` and include in all authenticated requests:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 👥 User Endpoints

### 1. Get All Users

**Endpoint:** `GET /users`

**Description:** List all users with pagination

**Query Parameters:**
- `page` (optional) - Page number, default: 1
- `pageSize` (optional) - Items per page, default: 10

**Example:** `GET /users?page=2&pageSize=5`

**Response:** `200 OK`
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "bio": "Software developer",
    "avatarUrl": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-31T10:00:00Z",
    "updatedAt": "2024-01-31T10:00:00Z"
  },
  ...
]
```

---

### 2. Get User by ID

**Endpoint:** `GET /users/:id`

**Description:** Get specific user profile with posts

**URL Parameters:**
- `id` (required) - User ID (UUID)

**Example:** `GET /users/550e8400-e29b-41d4-a716-446655440000`

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "bio": "Software developer",
  "avatarUrl": "https://example.com/avatar.jpg",
  "posts": [
    {
      "id": "post-id-1",
      "title": "My First Post",
      "content": "Content...",
      "createdAt": "2024-01-31T10:00:00Z"
    }
  ],
  "comments": [...]
}
```

---

### 3. Get Current User

**Endpoint:** `GET /users/profile/me`

**Authentication:** Required ✅

**Description:** Get logged-in user's profile

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  ...
}
```

---

### 4. Update User

**Endpoint:** `PUT /users/:id`

**Authentication:** Required ✅

**Description:** Update user profile

**URL Parameters:**
- `id` (required) - User ID

**Request Body (all optional):**
```json
{
  "username": "new_username",
  "email": "newemail@example.com",
  "fullName": "New Full Name",
  "bio": "New bio",
  "avatarUrl": "https://example.com/new-avatar.jpg"
}
```

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "new_username",
  ...
}
```

---

### 5. Delete User

**Endpoint:** `DELETE /users/:id`

**Authentication:** Required ✅

**Description:** Delete user account (permanent)

**Warning:** This deletes:
- User account
- All user's posts
- All user's comments

**Response:** `200 OK`
```json
{
  "message": "User deleted successfully"
}
```

---

## 📝 Post Endpoints

### 1. Get All Posts

**Endpoint:** `GET /posts`

**Description:** List all posts with pagination (newest first)

**Query Parameters:**
- `page` (optional) - Page number, default: 1
- `pageSize` (optional) - Items per page, default: 10

**Example:** `GET /posts?page=1&pageSize=10`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "post-id-1",
      "title": "My First Post",
      "content": "This is amazing content...",
      "imageUrl": "https://example.com/post-image.jpg",
      "likesCount": 42,
      "author": {
        "id": "user-id-1",
        "username": "john_doe",
        "fullName": "John Doe",
        "avatarUrl": "https://example.com/avatar.jpg"
      },
      "createdAt": "2024-01-31T10:00:00Z",
      "updatedAt": "2024-01-31T10:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 10,
  "totalPages": 10
}
```

---

### 2. Get Single Post

**Endpoint:** `GET /posts/:id`

**Description:** Get specific post with all comments

**URL Parameters:**
- `id` (required) - Post ID

**Example:** `GET /posts/post-id-1`

**Response:** `200 OK`
```json
{
  "id": "post-id-1",
  "title": "My First Post",
  "content": "Amazing content...",
  "imageUrl": "https://example.com/image.jpg",
  "likesCount": 42,
  "author": {
    "id": "user-id-1",
    "username": "john_doe",
    "fullName": "John Doe",
    "avatarUrl": "https://example.com/avatar.jpg"
  },
  "comments": [
    {
      "id": "comment-id-1",
      "content": "Great post!",
      "author": {
        "id": "user-id-2",
        "username": "jane_doe",
        "fullName": "Jane Doe"
      },
      "createdAt": "2024-01-31T11:00:00Z"
    }
  ],
  "createdAt": "2024-01-31T10:00:00Z"
}
```

---

### 3. Create Post

**Endpoint:** `POST /posts`

**Authentication:** Required ✅

**Description:** Create new blog post

**Request Body:**
```json
{
  "title": "My First Blog Post",
  "content": "This is the main content of my post. It can be quite long.",
  "imageUrl": "https://example.com/post-image.jpg (optional)"
}
```

**Validation Rules:**
- `title`: 5-200 characters, required
- `content`: Minimum 10 characters, required
- `imageUrl`: Valid URL format, optional

**Response:** `201 Created`
```json
{
  "id": "post-id-1",
  "title": "My First Blog Post",
  "content": "This is the main content...",
  "imageUrl": "https://example.com/post-image.jpg",
  "likesCount": 0,
  "author": {
    "id": "user-id-1",
    "username": "john_doe",
    ...
  },
  "createdAt": "2024-01-31T10:00:00Z",
  "updatedAt": "2024-01-31T10:00:00Z"
}
```

---

### 4. Update Post

**Endpoint:** `PUT /posts/:id`

**Authentication:** Required ✅

**Description:** Edit post (owner only)

**Authorization:** Only post author can update

**URL Parameters:**
- `id` (required) - Post ID

**Request Body (all optional):**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "imageUrl": "https://example.com/new-image.jpg"
}
```

**Response:** `200 OK`
```json
{
  "id": "post-id-1",
  "title": "Updated Title",
  ...
}
```

**Error Responses:**
- `403 Forbidden` - You are not the post author
- `404 Not Found` - Post doesn't exist

---

### 5. Delete Post

**Endpoint:** `DELETE /posts/:id`

**Authentication:** Required ✅

**Description:** Delete post (owner only)

**Authorization:** Only post author can delete

**Cascade:** All comments on this post are deleted

**URL Parameters:**
- `id` (required) - Post ID

**Response:** `200 OK`
```json
{
  "message": "Post deleted successfully"
}
```

---

### 6. Like Post

**Endpoint:** `POST /posts/:id/like`

**Authentication:** Required ✅

**Description:** Increment post's like count

**URL Parameters:**
- `id` (required) - Post ID

**Response:** `201 Created`
```json
{
  "id": "post-id-1",
  "title": "My First Post",
  "likesCount": 43,
  ...
}
```

---

### 7. Unlike Post

**Endpoint:** `POST /posts/:id/unlike`

**Authentication:** Required ✅

**Description:** Decrement post's like count

**URL Parameters:**
- `id` (required) - Post ID

**Response:** `201 Created`
```json
{
  "id": "post-id-1",
  "title": "My First Post",
  "likesCount": 42,
  ...
}
```

---

## 💬 Comment Endpoints

### 1. Get Post Comments

**Endpoint:** `GET /posts/:postId/comments`

**Description:** Get all comments for a post (oldest first)

**URL Parameters:**
- `postId` (required) - Post ID

**Example:** `GET /posts/post-id-1/comments`

**Response:** `200 OK`
```json
[
  {
    "id": "comment-id-1",
    "content": "Great post! Very informative.",
    "author": {
      "id": "user-id-2",
      "username": "jane_doe",
      "fullName": "Jane Doe",
      "avatarUrl": "https://example.com/jane-avatar.jpg"
    },
    "postId": "post-id-1",
    "createdAt": "2024-01-31T11:00:00Z",
    "updatedAt": "2024-01-31T11:00:00Z"
  },
  {
    "id": "comment-id-2",
    "content": "I completely agree!",
    "author": {
      "id": "user-id-3",
      "username": "bob_smith",
      "fullName": "Bob Smith"
    },
    "postId": "post-id-1",
    "createdAt": "2024-01-31T11:30:00Z",
    "updatedAt": "2024-01-31T11:30:00Z"
  }
]
```

---

### 2. Add Comment

**Endpoint:** `POST /posts/:postId/comments`

**Authentication:** Required ✅

**Description:** Add comment to a post

**URL Parameters:**
- `postId` (required) - Post ID

**Request Body:**
```json
{
  "content": "Great post! I really enjoyed reading this."
}
```

**Validation Rules:**
- `content`: Required, non-empty

**Response:** `201 Created`
```json
{
  "id": "comment-id-1",
  "content": "Great post! I really enjoyed reading this.",
  "author": {
    "id": "user-id-1",
    "username": "john_doe",
    "fullName": "John Doe",
    "avatarUrl": "https://example.com/avatar.jpg"
  },
  "postId": "post-id-1",
  "createdAt": "2024-01-31T11:00:00Z",
  "updatedAt": "2024-01-31T11:00:00Z"
}
```

**Error Responses:**
- `404 Not Found` - Post doesn't exist

---

### 3. Delete Comment

**Endpoint:** `DELETE /comments/:id`

**Authentication:** Required ✅

**Description:** Delete comment (owner only)

**Authorization:** Only comment author can delete

**URL Parameters:**
- `id` (required) - Comment ID

**Response:** `200 OK`
```json
{
  "message": "Comment deleted successfully"
}
```

**Error Responses:**
- `403 Forbidden` - You are not the comment author
- `404 Not Found` - Comment doesn't exist

---

## 🔍 HTTP Status Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Not authorized for this action |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Email/username already exists |
| 500 | Server Error | Server error |

---

## 🧪 Testing with cURL

### Register User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Post (with token)
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my post."
  }'
```

### Get All Posts
```bash
curl -X GET http://localhost:3000/posts
```

---

## 🧠 Learning Tips

1. **Start with authentication:**
   - Register a user
   - Login to get JWT token
   - Use token in authenticated requests

2. **Explore relationships:**
   - Create a post
   - Get the post with its author info
   - Add comments to the post

3. **Test authorization:**
   - Create post as user A
   - Try to update as user B
   - See 403 Forbidden error

4. **Use pagination:**
   - Create multiple posts
   - Test different page numbers
   - Observe how results change

---

## 📚 Related Files

- [Learning Guide](./LEARNING_GUIDE.md) - Complete learning guide
- [Database Schema](#) - Entity relationships
- [Architecture](./ARCHITECTURE.md) - System design

---

**Happy Coding! 🚀**
