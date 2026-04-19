export { patientApi } from './patient'
export type { Patient, CreatePatientDto, UpdatePatientDto } from './patient'

export { appointmentApi } from './appointment'
export type { Appointment, CreateAppointmentDto, UpdateAppointmentDto } from './appointment'

export { doctorApi } from './doctor'
export type { Doctor, CreateDoctorDto, UpdateDoctorDto } from './doctor'

export { staffApi } from './staff'
export type { Staff, CreateStaffDto, UpdateStaffDto } from './staff'

export { medicalRecordApi } from './medicalRecord'
export type { MedicalRecord, CreateMedicalRecordDto, Prescription } from './medicalRecord'

export { billingApi } from './billing'
export type { Invoice, Payment, InvoiceItem, CreateInvoiceDto, CreatePaymentDto } from './billing'
