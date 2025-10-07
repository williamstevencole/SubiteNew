# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SUBITE Backend is a transportation management API built with Express.js, TypeScript, and Sequelize ORM. The system manages companies, vehicles, drivers, passengers, and daily routes with role-based access control.

## Common Commands

### Development
```bash
npm run dev          # Start development server with tsx and nodemon
npm run build        # Compile TypeScript
npm run start        # Start production server from dist/
```

### Database Operations
```bash
npm run db:seed      # Populate database with test data
npm run db:create    # Create database
npm run db:migrate   # Run Sequelize migrations
npm run db:drop      # Drop database
```

### Docker Operations
```bash
docker-compose up --build --watch    # Start all services with hot reload
docker-compose down -v               # Stop and remove volumes
```

## Architecture Overview

### Core Structure
- **Config**: Environment validation with Zod (`src/config/env.ts`)
- **Database**: Sequelize models and seeders (`src/database/`)
- **Middleware**: Authentication, RBAC, validation, error handling (`src/middleware/`)
- **Controllers**: Business logic for each entity (`src/controllers/`)
- **Routes**: Express route definitions with validation (`src/routes/`)
- **Services**: Shared utilities like pagination (`src/services/`)

### Authentication & Authorization
- JWT-based authentication via `authenticateToken` middleware
- Role-based access control (RBAC) with three roles: MANAGER, DRIVER, PASSENGER
- Company-based data isolation - users can only access data from their assigned company
- Role-specific endpoints in `src/middleware/rbac.ts`

### Database Models
- **Company**: Top-level tenant entity
- **User**: Belongs to company, has role (MANAGER/DRIVER/PASSENGER)
- **Vehicle**: Belongs to company, optionally assigned to driver
- **DailyRoute**: Daily operational routes with vehicle/driver assignments
- **TripPosition**: GPS tracking data (not fully implemented)
- **TripTrace**: Route traces (not fully implemented)
- **RouteAttendance**: Passenger attendance (not fully implemented)
- **FileAsset**: File storage metadata (not fully implemented)

### Request Flow
1. Request hits Express app (`src/app.ts`)
2. Global middleware (CORS, helmet, logging)
3. Route-specific middleware (auth, validation, RBAC)
4. Controller executes business logic
5. Response formatted with standardized error/success structure

### Data Access Patterns
- All database queries filtered by user's `companyId` for multi-tenancy
- Cursor-based pagination preferred over offset pagination
- Role-based filtering applied in controllers:
  - MANAGERS: Full company access
  - DRIVERS: Only their assigned vehicles/routes
  - PASSENGERS: Read-only access to active vehicles/routes

## Key Implementation Details

### Validation Strategy
- Zod schemas for all request validation in route files
- Separate schemas for body, query, and params validation
- Error responses include validation details for debugging

### Error Handling
- Global error handler in `src/middleware/errorHandler.ts`
- Structured logging with request context
- Consistent error response format across all endpoints

### Database Seeding
- Automatic seeding on server startup (useful for Docker)
- Can be run independently with `npm run db:seed`
- Creates test companies, users, vehicles, and daily routes
- Default credentials: any email + "password123"
- Seeding is idempotent - won't duplicate data if run multiple times
- Includes realistic test data for Colombian transportation companies

### Environment Variables
Key variables in `.env`:
- `DATABASE_URL`: PostgreSQL connection string (uses Docker service names: `postgres:5432`)
- `JWT_ACCESS_SECRET`: JWT signing secret
- `PORT`: Server port (default 4000)
- `NODE_ENV`: Environment mode
- `REDIS_URL`: Redis connection string (uses Docker service name: `redis:6379`)

### Docker Configuration
- Multi-service setup: PostgreSQL, Redis, Backend
- Hot reload with file watching in development
- Automatic database seeding on container startup
- Improved health checks with retries and start period for PostgreSQL
- Restart policies for production reliability
- Database connection retry logic with exponential backoff (10 attempts, 2s delay)

## Testing & API Usage

See `API_EXAMPLES.md` for complete API documentation with curl examples.

### Test Credentials
- Manager: `manager@medellin.com / password123`
- Driver: `driver1@medellin.com / password123`
- Passenger: `passenger1@example.com / password123`
- Admin: `admin@subite.com / password123`

### Authentication Flow
1. POST `/api/auth/login` with email/password
2. Receive JWT token
3. Include `Authorization: Bearer <token>` header in subsequent requests

## Development Notes

### Converting from Prisma to Sequelize
This project was recently migrated from Prisma to Sequelize. The original README references Prisma commands that are no longer valid. Current database operations use Sequelize CLI.

### Database Connection Resilience
- Automatic retry logic for database connections (max 10 retries, 2s delay)
- Graceful handling of Docker container startup timing
- Health checks ensure PostgreSQL is ready before backend starts

### Type Safety
- Strict TypeScript configuration
- Custom types in `src/types/` for auth and API responses
- Sequelize model types properly exported from `src/database/models/index.ts`
- All nullable fields use `undefined` instead of `null` for TypeScript compatibility

### Module System
- ES modules (`"type": "module"` in package.json)
- All imports use `.js` extensions for compatibility
- tsx used for development TypeScript execution instead of ts-node

### Production Considerations
- Docker services configured with restart policies
- Structured logging for debugging and monitoring
- JWT tokens expire in 24 hours (configurable)
- Multi-company data isolation enforced at query level
