import api from '../client'

export interface Staff {
  id: string
  userId: string
  staffCode: string
  role: string
  position?: string
  department?: string
  fullName: string
  phone?: string
  email?: string
  dateOfBirth?: string
  hireDate?: string
  contractEndDate?: string
  education?: string
  licenseNumber?: string
  shift: 'morning' | 'afternoon' | 'night' | 'flexible'
  workingHours?: string
  workingDays: string[]
  salary?: number
  currency?: string
  assignedLocation?: string
  assignedDoctor?: string
  isActive: boolean
  status: 'active' | 'inactive' | 'on_leave' | 'terminated'
  emergencyContactName?: string
  emergencyContactPhone?: string
  emergencyContactRelation?: string
  notes?: string
  profileImage?: string
  createdAt: string
  updatedAt: string
}

export interface CreateStaffDto {
  userId: string
  role: string
  position?: string
  department?: string
  fullName: string
  phone?: string
  email?: string
  dateOfBirth?: string
  hireDate?: string
  education?: string
  licenseNumber?: string
  shift?: string
  workingHours?: string
  workingDays?: string[]
  salary?: number
  currency?: string
  assignedLocation?: string
  assignedDoctor?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  emergencyContactRelation?: string
  notes?: string
}

export interface UpdateStaffDto extends Partial<CreateStaffDto> {
  isActive?: boolean
  status?: string
}

export const staffApi = {
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
    department?: string
  }) => {
    const response = await api.get('/staff', { params })
    return response.data
  },

  getById: async (id: string): Promise<Staff> => {
    const response = await api.get(`/staff/${id}`)
    return response.data
  },

  create: async (data: CreateStaffDto): Promise<Staff> => {
    const response = await api.post('/staff', data)
    return response.data
  },

  update: async (id: string, data: UpdateStaffDto): Promise<Staff> => {
    const response = await api.patch(`/staff/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    const response = await api.delete(`/staff/${id}`)
    return response.data
  },

  getStatistics: async () => {
    const response = await api.get('/staff/statistics')
    return response.data
  },
}
