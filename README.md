# Blog API

A comprehensive Blog API built with NestJS and Prisma, implementing Phase 1 functionality with modern development practices.

## Features
- **User Management**: CRUD operations for users with password hashing
- **Post Management**: CRUD operations for blog posts
- **Relationships**: Posts are linked to their authors (users)
- **API Documentation**: Swagger/OpenAPI documentation available at `/docs`
- **Database**: PostgreSQL with Prisma ORM

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend-test-code
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/blog_api?schema=public"
   PORT=3001
   ```
   
   Update the DATABASE_URL with your PostgreSQL credentials.

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev --name init
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

## API Endpoints

### Users
- `POST /users` - Create a new user
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Posts
- `POST /posts` - Create a new post
- `GET /posts` - Get all posts with their authors
- `GET /posts/:id` - Get post by ID with author
- `PATCH /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post

## API Documentation

Visit `http://localhost:3001/docs` to view the interactive API documentation.

## Database Schema

### User
- `id` (Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Post
- `id` (Primary Key)
- `title` (String)
- `content` (String)
- `userId` (Foreign Key to User)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Development

```bash
# Lint code
npm run lint

# Format code
npm run format

# Prisma commands
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Create and apply migrations
npm run prisma:studio      # Open Prisma Studio (database GUI)
npm run prisma:db:push     # Push schema changes to database
npm run prisma:db:pull     # Pull database schema to Prisma schema
```

## Architecture

### Repository Pattern
- **Repository Layer**: Handles all database operations
- **Service Layer**: Contains business logic and validation
- **Controller Layer**: Manages HTTP requests and responses

### Logging
- Structured logging with correlation IDs
- Request/response tracing
- Error logging with context
- Performance monitoring

### Validation
- UUID format validation for all ID parameters
- Foreign key validation for relationships
- Input validation with custom error messages
- Password hashing for security
