# Clinic Management System - Backend

NestJS-based REST API for Clinic Management System with JWT authentication, RBAC, and MongoDB.

## Features

- ✅ JWT Authentication with refresh tokens
- ✅ Role-Based Access Control (RBAC)
- ✅ MongoDB with Mongoose ODM
- ✅ Request validation with class-validator
- ✅ Global exception handling
- ✅ Swagger/OpenAPI documentation
- ✅ Database seeding
- ✅ Environment-based configuration

## Installation

```bash
npm install
```

## Setup

1. Copy the environment file:
```bash
cp .env.example .env.development
```

2. Update the environment variables in `.env.development`

3. Ensure MongoDB is running locally or update `MONGODB_URI` in your `.env` file

## Running the App

```bash
# Development mode
npm run start:dev

# Debug mode
npm run start:debug

# Production mode
npm run build
npm run start:prod
```

## Database Seeding

Create default users for testing:

```bash
npm run seed
```

Default users after seeding:
- **Admin**: admin@clinic.com / Admin@123
- **Doctor**: doctor@clinic.com / Doctor@123
- **Nurse**: nurse@clinic.com / Nurse@123
- **Receptionist**: receptionist@clinic.com / Receptionist@123
- **Patient**: patient@clinic.com / Patient@123

## API Documentation

Once the application is running, Swagger documentation is available at:

```
http://localhost:3001/api
```

## Available Roles

- `admin` - Full system access
- `doctor` - Manage patients, appointments, medical records
- `nurse` - Assist doctors, manage appointments
- `receptionist` - Manage appointments and patient registration
- `patient` - View own records and appointments

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user profile

### Users
- `POST /users` - Create user
- `GET /users` - List users (paginated)
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

```
src/
├── config/                 # Configuration files
├── filters/                # Global exception filters
├── modules/
│   ├── user/              # User module (CRUD, schema, DTOs)
│   ├── auth/              # Authentication module (JWT, guards)
│   └── common/            # Shared utilities (RBAC, decorators)
├── seed/                   # Database seeding
├── app.module.ts           # Root module
├── app.controller.ts       # Root controller
├── app.service.ts          # Root service
├── main.ts                 # Application entry point
└── swagger.config.ts       # Swagger configuration
```

## Technologies

- **NestJS** - Progressive Node.js framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Passport.js** - Authentication middleware
- **JWT** - Token-based authentication
- **class-validator** - Request validation
- **Swagger** - API documentation

## License

UNLICENSED
