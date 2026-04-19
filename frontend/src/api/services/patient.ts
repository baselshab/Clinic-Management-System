import api from '../client'

export interface Patient {
  id: string
  userId: string
  patientCode: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  phone?: string
  email?: string
  address?: string
  city?: string
  country?: string
  postalCode?: string
  bloodType?: string
  height?: number
  weight?: number
  allergies: string[]
  familyHistory: string[]
  currentMedications: string[]
  emergencyContactName?: string
  emergencyContactPhone?: string
  emergencyContactRelation?: string
  isActive: boolean
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreatePatientDto {
  userId?: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  phone?: string
  email?: string
  address?: string
  city?: string
  country?: string
  postalCode?: string
  bloodType?: string
  height?: number
  weight?: number
  allergies?: string[]
  familyHistory?: string[]
  currentMedications?: string[]
  emergencyContactName?: string
  emergencyContactPhone?: string
  emergencyContactRelation?: string
  notes?: string
}

export interface UpdatePatientDto extends Partial<CreatePatientDto> {
  isActive?: boolean
}

export const patientApi = {
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
    gender?: string
    bloodType?: string
  }) => {
    const response = await api.get('/patients', { params })
    return response.data
  },

  getById: async (id: string): Promise<Patient> => {
    const response = await api.get(`/patients/${id}`)
    return response.data
  },

  create: async (data: CreatePatientDto): Promise<Patient> => {
    const response = await api.post('/patients', data)
    return response.data
  },

  update: async (id: string, data: UpdatePatientDto): Promise<Patient> => {
    const response = await api.patch(`/patients/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    const response = await api.delete(`/patients/${id}`)
    return response.data
  },

  getStatistics: async () => {
    const response = await api.get('/patients/statistics')
    return response.data
  },
}
