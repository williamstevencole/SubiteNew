# SubiTe Backend API

A secure, read-only Express + TypeScript backend with Prisma (PostgreSQL) for the SubiTe transportation management system.

## Features

- 🔐 **JWT Authentication** - Read-only access tokens
- 👥 **Role-Based Access Control** - MANAGER, DRIVER, PASSENGER roles
- 🛡️ **Security Middleware** - Helmet, CORS, rate limiting
- 📊 **Pagination** - Cursor-based and offset-based pagination
- ✅ **Input Validation** - Zod schemas for all query parameters
- 🏢 **Multi-tenant** - Company-based data isolation
- 📝 **Structured Logging** - Request tracing and error handling
- 🧪 **Testing** - Unit tests with Vitest

## Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod
- **Security**: Helmet, CORS, JWT, Rate Limiting
- **Testing**: Vitest

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Set up the database:**
   ```bash
   npm run db:migrate
   npm run db:generate
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/subite?schema=public"

# Server
PORT=4000
NODE_ENV=development

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-jwt-key-change-in-production

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_REQUESTS_PER_MINUTE=60
RATE_LIMIT_REQUESTS_PER_USER=120
```

## API Endpoints

All endpoints require authentication via JWT Bearer token in the `Authorization` header.

### Authentication
- **Header**: `Authorization: Bearer <token>`
- **JWT Payload**: Must contain `sub` (userId), `role`, `companyId`, `email`

### Companies
- `GET /api/v1/companies/:id` - Get company details (MANAGER only)
- `GET /api/v1/companies/:id/vehicles` - Get company vehicles (role-based filtering)

### Users
- `GET /api/v1/users/me` - Get current user profile
- `GET /api/v1/users` - List users (MANAGER only, paginated)

### Vehicles
- `GET /api/v1/vehicles/:id` - Get vehicle details (role-based access)

### Daily Routes
- `GET /api/v1/daily-routes` - List daily routes (filtered by role, paginated)
- `GET /api/v1/daily-routes/:id` - Get specific daily route
- `GET /api/v1/daily-routes/:id/positions` - Get route positions (paginated)
- `GET /api/v1/daily-routes/:id/attendances` - Get route attendances (MANAGER/DRIVER only)

### File Assets
- `GET /api/v1/file-assets/:id` - Get file asset metadata (access controlled)

### Health Check
- `GET /api/v1/health` - Service health status (no auth required)

## Role-Based Access Control

### MANAGER
- Can access all company data
- Can view all vehicles, routes, users within their company
- Can access attendance data

### DRIVER
- Can only access their assigned vehicle
- Can only view their assigned daily routes
- Can access positions and attendances for their routes

### PASSENGER
- Can only view active vehicles in their company
- Can view daily routes within their company (read-only)
- Cannot access attendance data

## Pagination

### Cursor-based (recommended)
```
GET /api/v1/daily-routes?limit=20&cursor=123456789
```

### Offset-based (fallback)
```
GET /api/v1/users?page=2&limit=10
```

## Response Format

### Success Response
```json
{
  "data": [...],
  "pageInfo": {
    "nextCursor": "123456789",
    "hasNextPage": true
  }
}
```

### Error Response
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied"
  }
}
```

## Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:migrate   # Run database migrations
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio
npm run db:push      # Push schema changes (development)
npm run db:reset     # Reset database

# Testing
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage
```

## Security Considerations

- **JWT Tokens**: Only for read operations. Use short expiration times (15 min recommended)
- **Rate Limiting**: 60 requests/minute per IP, 120/minute per authenticated user
- **Input Validation**: All query parameters validated with Zod schemas
- **Multi-tenant Isolation**: All queries filtered by user's `companyId`
- **Sensitive Data**: `authId` and `notificationId` never exposed in API responses
- **CORS**: Configured for specific origins only
- **Headers**: Security headers via Helmet middleware

## Development Notes

This is a **read-only API** skeleton. TODO comments mark where write operations (POST/PUT/DELETE) should be implemented:

- User management (create, update, delete users)
- Vehicle management (CRUD operations)
- Daily route management (create, update routes)
- Real-time position updates
- Attendance marking
- File upload/management

## Docker Support

The project includes Docker Compose configuration for PostgreSQL and Redis. The backend can also be containerized for development and production deployment.

## Contributing

1. Follow TypeScript strict mode guidelines
2. Add tests for new functionality
3. Ensure all endpoints follow the established patterns
4. Maintain proper error handling and logging
5. Preserve security and RBAC patterns