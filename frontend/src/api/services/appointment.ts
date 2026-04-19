import api from '../client'

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  receptionistId?: string
  appointmentCode: string
  scheduledDate: string
  duration: number
  appointmentType: 'consultation' | 'follow_up' | 'emergency' | 'check_up' | 'procedure'
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  reason?: string
  symptoms?: string
  notes?: string
  doctorNotes?: string
  diagnosis?: string
  treatmentPlan: string[]
  consultationFee?: number
  isFollowUpNeeded: boolean
  followUpDate?: string
  sendReminder: boolean
  location?: string
  createdAt: string
  updatedAt: string
}

export interface CreateAppointmentDto {
  patientId: string
  doctorId: string
  scheduledDate: string
  duration: number
  appointmentType: string
  priority?: string
  reason?: string
  symptoms?: string
  notes?: string
  consultationFee?: number
  isFollowUpNeeded?: boolean
  followUpDate?: string
  sendReminder?: boolean
  location?: string
}

export interface UpdateAppointmentDto extends Partial<CreateAppointmentDto> {
  status?: string
  doctorNotes?: string
  diagnosis?: string
  treatmentPlan?: string[]
  cancellationReason?: string
}

export const appointmentApi = {
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
    patientId?: string
    doctorId?: string
    status?: string
    startDate?: string
    endDate?: string
  }) => {
    const response = await api.get('/appointments', { params })
    return response.data
  },

  getById: async (id: string): Promise<Appointment> => {
    const response = await api.get(`/appointments/${id}`)
    return response.data
  },

  create: async (data: CreateAppointmentDto): Promise<Appointment> => {
    const response = await api.post('/appointments', data)
    return response.data
  },

  update: async (id: string, data: UpdateAppointmentDto): Promise<Appointment> => {
    const response = await api.patch(`/appointments/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    const response = await api.delete(`/appointments/${id}`)
    return response.data
  },

  getStatistics: async () => {
    const response = await api.get('/appointments/statistics')
    return response.data
  },

  getAvailableSlots: async (doctorId: string, date: string) => {
    const response = await api.get('/appointments/available-slots', {
      params: { doctorId, date },
    })
    return response.data
  },
}
