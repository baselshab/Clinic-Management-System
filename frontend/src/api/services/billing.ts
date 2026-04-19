import api from '../client'

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

export interface Invoice {
  id: string
  patientId: string
  doctorId?: string
  appointmentId?: string
  medicalRecordId?: string
  invoiceNumber: string
  invoiceType: string
  status: string
  items: InvoiceItem[]
  subtotal: number
  discountPercent: number
  discountAmount: number
  taxPercent: number
  taxAmount: number
  totalAmount: number
  paidAmount: number
  balanceAmount: number
  issueDate: string
  dueDate?: string
  description?: string
  notes?: string
  paymentInstructions?: string
  internalNotes?: string
  insuranceProvider?: string
  insurancePolicyNumber?: string
  insuranceCoverageAmount: number
  isInsuranceClaim: boolean
  paidAt?: string
  cancelledAt?: string
  cancellationReason?: string
  refundedAt?: string
  refundReason?: string
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  invoiceId: string
  patientId: string
  doctorId?: string
  paymentReference: string
  amount: number
  paymentMethod: string
  status: string
  paymentDate: string
  description?: string
  paymentGateway?: string
  transactionId?: string
  referenceNumber?: string
  notes?: string
  processedBy?: string
  failureReason?: string
  refundReason?: string
  refundedAmount: number
  refundedAt?: string
  cancelledAt?: string
  cancellationReason?: string
  currency: string
  exchangeRate: number
  createdAt: string
  updatedAt: string
}

export interface CreateInvoiceDto {
  patientId: string
  doctorId?: string
  appointmentId?: string
  medicalRecordId?: string
  invoiceType: string
  status?: string
  items: InvoiceItem[]
  subtotal: number
  discountPercent?: number
  discountAmount?: number
  taxPercent?: number
  taxAmount?: number
  totalAmount: number
  paidAmount?: number
  balanceAmount?: number
  issueDate: string
  dueDate?: string
  description?: string
  notes?: string
  paymentInstructions?: string
  internalNotes?: string
  insuranceProvider?: string
  insurancePolicyNumber?: string
  insuranceCoverageAmount?: number
  isInsuranceClaim?: boolean
}

export interface CreatePaymentDto {
  invoiceId: string
  patientId: string
  doctorId?: string
  amount: number
  paymentMethod: string
  status?: string
  paymentDate: string
  description?: string
  paymentGateway?: string
  transactionId?: string
  referenceNumber?: string
  notes?: string
  processedBy?: string
  currency?: string
  exchangeRate?: number
}

export const billingApi = {
  // Invoices
  getInvoices: async (params?: {
    page?: number
    limit?: number
    search?: string
    patientId?: string
    doctorId?: string
    status?: string
    invoiceType?: string
    startDate?: string
    endDate?: string
  }) => {
    const response = await api.get('/invoices', { params })
    return response.data
  },

  getInvoiceById: async (id: string): Promise<Invoice> => {
    const response = await api.get(`/invoices/${id}`)
    return response.data
  },

  createInvoice: async (data: CreateInvoiceDto): Promise<Invoice> => {
    const response = await api.post('/invoices', data)
    return response.data
  },

  updateInvoice: async (id: string, data: Partial<CreateInvoiceDto>): Promise<Invoice> => {
    const response = await api.patch(`/invoices/${id}`, data)
    return response.data
  },

  deleteInvoice: async (id: string): Promise<void> => {
    const response = await api.delete(`/invoices/${id}`)
    return response.data
  },

  markInvoiceSent: async (id: string): Promise<Invoice> => {
    const response = await api.post(`/invoices/${id}/send`)
    return response.data
  },

  cancelInvoice: async (id: string, reason: string): Promise<Invoice> => {
    const response = await api.post(`/invoices/${id}/cancel`, { reason })
    return response.data
  },

  getInvoiceStatistics: async () => {
    const response = await api.get('/invoices/statistics')
    return response.data
  },

  // Payments
  getPayments: async (params?: {
    page?: number
    limit?: number
    search?: string
    patientId?: string
    doctorId?: string
    invoiceId?: string
    status?: string
    paymentMethod?: string
    startDate?: string
    endDate?: string
  }) => {
    const response = await api.get('/payments', { params })
    return response.data
  },

  createPayment: async (data: CreatePaymentDto): Promise<Payment> => {
    const response = await api.post('/payments', data)
    return response.data
  },

  markPaymentCompleted: async (id: string): Promise<Payment> => {
    const response = await api.post(`/payments/${id}/complete`)
    return response.data
  },

  getPaymentStatistics: async () => {
    const response = await api.get('/payments/statistics')
    return response.data
  },
}
