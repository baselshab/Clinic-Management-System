import api from '../client'

export interface Prescription {
  medication: string
  dosage: string
  frequency?: string
  duration?: number
  durationUnit?: string
  instructions?: string
}

export interface MedicalRecord {
  id: string
  patientId: string
  doctorId: string
  appointmentId?: string
  recordCode: string
  visitDate: string
  visitType: string
  status: 'draft' | 'finalized' | 'amended' | 'archived'
  chiefComplaint?: string
  physicalExamination?: string
  vitalSigns?: string
  diagnosis?: string
  diagnosisCode?: string
  differentialDiagnosis?: string
  labTestsOrdered?: string
  labResults?: string
  prescribedMedications: string[]
  prescriptions: Prescription[]
  treatmentPlan: string[]
  referrals?: string
  followUpInstructions?: string
  followUpDate?: string
  doctorNotes?: string
  attachments: string[]
  isSensitive: boolean
  sensitivityReason?: string
  createdAt: string
  updatedAt: string
}

export interface CreateMedicalRecordDto {
  patientId: string
  doctorId: string
  appointmentId?: string
  visitDate: string
  visitType: string
  status?: string
  chiefComplaint?: string
  physicalExamination?: string
  vitalSigns?: string
  diagnosis?: string
  diagnosisCode?: string
  differentialDiagnosis?: string
  labTestsOrdered?: string
  labResults?: string
  prescribedMedications?: string[]
  prescriptions?: Prescription[]
  treatmentPlan?: string[]
  referrals?: string
  followUpInstructions?: string
  followUpDate?: string
  doctorNotes?: string
  attachments?: string[]
  isSensitive?: boolean
  sensitivityReason?: string
}

export interface UpdateMedicalRecordDto extends Partial<CreateMedicalRecordDto> {}

export const medicalRecordApi = {
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
    patientId?: string
    doctorId?: string
    status?: string
    visitType?: string
    startDate?: string
    endDate?: string
  }) => {
    const response = await api.get('/medical-records', { params })
    return response.data
  },

  getById: async (id: string): Promise<MedicalRecord> => {
    const response = await api.get(`/medical-records/${id}`)
    return response.data
  },

  create: async (data: CreateMedicalRecordDto): Promise<MedicalRecord> => {
    const response = await api.post('/medical-records', data)
    return response.data
  },

  update: async (id: string, data: UpdateMedicalRecordDto): Promise<MedicalRecord> => {
    const response = await api.patch(`/medical-records/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    const response = await api.delete(`/medical-records/${id}`)
    return response.data
  },

  findByPatientId: async (patientId: string) => {
    const response = await api.get(`/medical-records/patient/${patientId}`)
    return response.data
  },

  finalize: async (id: string): Promise<MedicalRecord> => {
    const response = await api.post(`/medical-records/${id}/finalize`)
    return response.data
  },

  getStatistics: async () => {
    const response = await api.get('/medical-records/statistics')
    return response.data
  },
}
