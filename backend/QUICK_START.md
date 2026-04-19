# Quick Start Guide - Clinic Management System Backend

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** v18+ (https://nodejs.org/)
- **MongoDB** v6+ (https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

## Installation & Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

The development environment file already exists at `.env.development`. You can modify it if needed:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/clinic-management
JWT_SECRET=your-secret-key
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
# If MongoDB is installed as a service, it should start automatically
# Otherwise, start it manually:
mongod
```

**macOS/Linux:**
```bash
# Start MongoDB service
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### 4. Seed the Database (Optional but Recommended)

Create default users for testing:

```bash
npm run seed
```

This will create the following test users:
- **Admin**: admin@clinic.com / Admin@123
- **Doctor**: doctor@clinic.com / Doctor@123
- **Nurse**: nurse@clinic.com / Nurse@123
- **Receptionist**: receptionist@clinic.com / Receptionist@123
- **Patient**: patient@clinic.com / Patient@123

### 5. Start the Development Server

```bash
npm run start:dev
```

The server will start on `http://localhost:3001`

### 6. Access API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3001/api

## Testing the API

### Register a New User

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "Test@1234"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@clinic.com",
    "password": "Admin@123"
  }'
```

### Get Current User (Requires Authentication)

```bash
curl http://localhost:3001/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Available Scripts

```bash
npm run start:dev    # Start development server with hot reload
npm run start:prod   # Start production server
npm run build        # Build the project
npm run seed         # Seed the database with default users
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:cov     # Run tests with coverage
npm run lint         # Run linter
npm run format       # Format code with Prettier
```

## Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   └── jwt.config.ts
│   ├── filters/             # Exception filters
│   │   └── all-exceptions.filter.ts
│   ├── modules/
│   │   ├── user/           # User module
│   │   │   ├── schemas/
│   │   │   ├── dto/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.module.ts
│   │   ├── auth/           # Authentication module
│   │   │   ├── dto/
│   │   │   ├── strategies/
│   │   │   ├── guards/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   └── common/         # Shared utilities
│   │       ├── decorators/
│   │       └── guards/
│   ├── seed/               # Database seeding
│   ├── app.module.ts
│   ├── main.ts
│   └── swagger.config.ts
├── .env.development
├── .env.example
└── package.json
```

## Common Issues

### MongoDB Connection Error

If you see a MongoDB connection error:
1. Make sure MongoDB is running
2. Check the `MONGODB_URI` in your `.env.development` file
3. Default: `mongodb://localhost:27017/clinic-management`

### Port Already in Use

If port 3001 is already in use:
1. Change the `PORT` value in `.env.development`
2. Or set the `PORT` environment variable before starting

### Build Errors

If you encounter build errors:
```bash
rm -rf dist/
npm run build
```

## Next Steps

- [ ] Implement Phase 2: Patient & Staff Modules
- [ ] Add appointment scheduling
- [ ] Create medical records module
- [ ] Build billing system
- [ ] Develop frontend application

## Support

For issues or questions:
1. Check the `BACKEND_README.md` file
2. Review the API documentation at http://localhost:3001/api
3. Check the TODOS.md file for project progress
