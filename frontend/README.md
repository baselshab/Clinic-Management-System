# Clinic Management System - Frontend

A modern React-based frontend application for the Clinic Management System.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Axios** - HTTP client

## Prerequisites

- Node.js 18+ 
- Backend server running on port 3001

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── api/                 # API client and services
│   ├── client.ts       # Axios instance with interceptors
│   └── auth.ts         # Auth API endpoints
├── components/          # Reusable components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   └── auth/           # Authentication pages
├── store/              # Redux Toolkit store
│   └── slices/         # Redux slices
├── theme/              # MUI theme configuration
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Features

### ✅ Implemented (Phase 6)
- Authentication system (Login/Register)
- Role-based access control
- Protected routes
- Responsive layout with sidebar navigation
- Redux state management
- API integration with automatic token refresh
- Material-UI theme configuration

### 🚧 Coming Soon
- Patient management UI
- Appointment scheduling UI
- Doctor & staff management UI
- Medical records UI
- Billing & payments UI
- Dashboard with analytics

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001/api
```

### Backend Connection

The frontend expects the backend to be running on `http://localhost:3001`. Update the `VITE_API_URL` environment variable if your backend is on a different port.

## Default Credentials

After running the backend seed script:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@clinic.com | Admin@123 |
| Doctor | doctor1@clinic.com | Doctor@123 |
| Nurse | nurse@clinic.com | Nurse@123 |
| Receptionist | receptionist@clinic.com | Receptionist@123 |
| Patient | patient1@clinic.com | Patient@123 |

## User Roles

- **Admin** - Full access to all features
- **Doctor** - Access to patients, appointments, medical records
- **Nurse** - Access to patients, appointments, medical records
- **Receptionist** - Access to patients, appointments, billing
- **Patient** - View own records and appointments

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## License

MIT
