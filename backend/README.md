# Clinic Management System - Backend

NestJS-based REST API for Clinic Management System with JWT authentication, RBAC, and MongoDB.

## Features

- ✅ JWT Authentication with refresh tokens
- ✅ Role-Based Access Control (RBAC) - 5 roles
- ✅ MongoDB with Mongoose ODM
- ✅ Request validation with class-validator
- ✅ Global exception handling
- ✅ Swagger/OpenAPI documentation
- ✅ Database seeding with sample data
- ✅ Environment-based configuration

## Modules

### Phase 1 ✅ - Core Infrastructure

- **User Module** - User management with roles
- **Auth Module** - JWT authentication, login, register, refresh
- **Common Module** - RBAC guards, decorators

### Phase 2 ✅ - Patient, Doctor & Staff Modules

- **Patient Module** - Patient records, medical history, demographics
- **Doctor Module** - Doctor profiles, specializations, schedules
- **Staff Module** - Staff management (nurses, receptionists, etc.)

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

Create default users, patients, doctors, and staff for testing:

```bash
npm run seed
```

Default users after seeding:

- **Admin**: admin@clinic.com / Admin@123
- **Doctor 1**: doctor1@clinic.com / Doctor@123
- **Doctor 2**: doctor2@clinic.com / Doctor@123
- **Nurse**: nurse@clinic.com / Nurse@123
- **Receptionist**: receptionist@clinic.com / Receptionist@123
- **Patient 1**: patient1@clinic.com / Patient@123
- **Patient 2**: patient2@clinic.com / Patient@123

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

### Patients

- `POST /patients` - Create patient record (Admin, Receptionist)
- `GET /patients` - List patients (Admin, Doctor, Nurse, Receptionist)
- `GET /patients/statistics` - Get patient statistics (Admin)
- `GET /patients/:id` - Get patient by ID (Admin, Doctor, Nurse)
- `PATCH /patients/:id` - Update patient (Admin, Doctor)
- `DELETE /patients/:id` - Delete patient (Admin)

### Doctors

- `POST /doctors` - Create doctor record (Admin)
- `GET /doctors` - List doctors (Admin, Doctor, Nurse, Receptionist)
- `GET /doctors/statistics` - Get doctor statistics (Admin)
- `GET /doctors/specialization/:specialization` - Find by specialization
- `GET /doctors/:id` - Get doctor by ID
- `PATCH /doctors/:id` - Update doctor (Admin)
- `DELETE /doctors/:id` - Delete doctor (Admin)

### Staff

- `POST /staff` - Create staff record (Admin)
- `GET /staff` - List staff (Admin, Doctor)
- `GET /staff/statistics` - Get staff statistics (Admin)
- `GET /staff/role/:role` - Find by role
- `GET /staff/:id` - Get staff by ID
- `PATCH /staff/:id` - Update staff (Admin)
- `DELETE /staff/:id` - Delete staff (Admin)

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
│   ├── common/            # Shared utilities (RBAC, decorators)
│   ├── patient/           # Patient management module
│   ├── doctor/            # Doctor management module
│   └── staff/             # Staff management module
├── seed/                   # Database seeding
├── app.module.ts           # Root module
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
