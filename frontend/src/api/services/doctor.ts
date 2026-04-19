import api from '../client'

export interface Doctor {
  id: string
  userId: string
  doctorCode: string
  specialization: string
  subSpecialties: string[]
  yearsOfExperience: number
  qualifications: string
  licenseNumber: string
  licenseExpiryDate: string
  biography?: string
  consultationFee: number
  consultationTypes: string[]
  appointmentDuration: number
  maxPatientsPerDay: number
  isAvailable: boolean
  status: 'active' | 'inactive' | 'on_leave'
  clinicLocation?: string
  clinicFloor?: string
  workingHours?: string
  workingDays: string[]
  certifications: string[]
  profileImage?: string
  rating?: number
  totalReviews?: number
  languages: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateDoctorDto {
  userId: string
  specialization: string
  subSpecialties?: string[]
  yearsOfExperience?: number
  qualifications?: string
  licenseNumber?: string
  licenseExpiryDate?: string
  biography?: string
  consultationFee?: number
  consultationTypes?: string[]
  appointmentDuration?: number
  maxPatientsPerDay?: number
  clinicLocation?: string
  clinicFloor?: string
  workingHours?: string
  workingDays?: string[]
  certifications?: string[]
  languages?: string[]
}

export interface UpdateDoctorDto extends Partial<CreateDoctorDto> {
  isAvailable?: boolean
  status?: string
}

export const doctorApi = {
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
    specialization?: string
    isAvailable?: boolean
  }) => {
    const response = await api.get('/doctors', { params })
    return response.data
  },

  getById: async (id: string): Promise<Doctor> => {
    const response = await api.get(`/doctors/${id}`)
    return response.data
  },

  create: async (data: CreateDoctorDto): Promise<Doctor> => {
    const response = await api.post('/doctors', data)
    return response.data
  },

  update: async (id: string, data: UpdateDoctorDto): Promise<Doctor> => {
    const response = await api.patch(`/doctors/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    const response = await api.delete(`/doctors/${id}`)
    return response.data
  },

  getStatistics: async () => {
    const response = await api.get('/doctors/statistics')
    return response.data
  },
}
