export interface User {
  _id?: string
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  status?: UserStatus
  createdAt?: string
  updatedAt?: string
  avatar?: string
}

export enum UserRole {
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  RECEPTIONIST = 'receptionist',
  PATIENT = 'patient',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  name: string
  password: string
  role?: UserRole
  phone?: string
}

export interface AuthResponse {
  user?: User
  accessToken: string
  refreshToken: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  totalPages: number
}
