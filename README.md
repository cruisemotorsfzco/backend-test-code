# Blog API

## Features

### Phase 1: Core CRUD + Database
- **User Management**: CRUD operations for users with password hashing
- **Post Management**: CRUD operations for blog posts
- **Relationships**: Posts are linked to their authors (users)
- **Database**: PostgreSQL with Prisma ORM
- **UUID Primary Keys**: Secure UUID-based identifiers
- **Repository Pattern**: Clean separation of data access and business logic
- **Structured Logging**: Comprehensive logging with request tracing
- **API Documentation**: Swagger/OpenAPI documentation available at `/docs`

### Phase 2: Authentication + RBAC
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: User and Admin roles with granular permissions
- **Route Protection**: Guards for protected endpoints
- **Post Ownership**: Users can only modify their own posts
- **Admin Privileges**: Admins can manage all users and posts
- **Password Security**: Bcrypt password hashing
- **Token Management**: 24-hour JWT token expiration

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
   JWT_SECRET="your-super-secret-jwt-key-here"
   PORT=3001
   ```
   
   Update the DATABASE_URL with your PostgreSQL credentials and set a strong JWT_SECRET.

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Push schema to database (creates tables)
   npm run prisma:db:push
   
   # Alternative: Run migrations (requires shadow database permissions)
   npm run prisma:migrate
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

## API Documentation

Visit `http://localhost:3001/docs` to view the interactive API documentation.

## Authentication & Authorization

### User Roles
- **`USER`** - Regular users (default role)
- **`ADMIN`** - Administrative users with full access

### Access Control
- **Public Endpoints**: Post listing and viewing
- **Authenticated Endpoints**: Post creation, user profile
- **Role-Based Endpoints**: User management (Admin only)
- **Ownership-Based Endpoints**: Post modification (author or Admin only)

### JWT Token Usage
```bash
# Include in request headers
Authorization: Bearer <your-jwt-token>
```

## Database Schema

### User
- `id` (UUID, Primary Key) - Auto-generated UUID
- `name` (String) - User's full name
- `email` (String, Unique) - User's email address
- `password` (String) - Hashed password using bcrypt
- `role` (Role) - User role (USER/ADMIN)
- `createdAt` (DateTime) - Record creation timestamp
- `updatedAt` (DateTime) - Record last update timestamp

### Post
- `id` (UUID, Primary Key) - Auto-generated UUID
- `title` (String) - Post title
- `content` (String) - Post content/body
- `userId` (UUID, Foreign Key) - References User.id with cascade delete
- `createdAt` (DateTime) - Record creation timestamp
- `updatedAt` (DateTime) - Record last update timestamp

### Role Enum
- `USER` - Regular user role
- `ADMIN` - Administrative role

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

### Authentication & Authorization
- **JWT Strategy**: Token-based authentication
- **Local Strategy**: Username/password validation
- **Role Guards**: Role-based access control
- **Ownership Guards**: Resource ownership validation

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
- JWT token validation

## Error Handling

### HTTP Status Codes
- **200 OK**: Successful operation
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid input data or validation error
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Insufficient permissions (role/ownership)
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists (e.g., duplicate email)

### Security Features
- **Password Hashing**: All passwords hashed with bcrypt
- **JWT Tokens**: Secure token-based authentication with 24-hour expiration
- **Role-Based Access**: Granular permissions based on user roles
- **Resource Ownership**: Users can only modify their own posts
- **Input Validation**: Comprehensive validation for all inputs
- **UUID Security**: Secure UUID-based identifiers instead of sequential IDs
