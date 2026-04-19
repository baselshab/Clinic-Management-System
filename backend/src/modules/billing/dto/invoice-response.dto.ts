import { ApiProperty } from '@nestjs/swagger';
import { InvoiceStatus, InvoiceType } from '../schemas/invoice.schema';

export class InvoiceItemResponseDto {
  @ApiProperty()
  description: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  amount: number;
}

export class InvoiceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  patientId: string;

  @ApiProperty()
  doctorId?: string;

  @ApiProperty()
  appointmentId?: string;

  @ApiProperty()
  medicalRecordId?: string;

  @ApiProperty()
  invoiceNumber: string;

  @ApiProperty()
  invoiceType: InvoiceType;

  @ApiProperty()
  status: InvoiceStatus;

  @ApiProperty({ type: [InvoiceItemResponseDto] })
  items: InvoiceItemResponseDto[];

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  discountPercent: number;

  @ApiProperty()
  discountAmount: number;

  @ApiProperty()
  taxPercent: number;

  @ApiProperty()
  taxAmount: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  paidAmount: number;

  @ApiProperty()
  balanceAmount: number;

  @ApiProperty()
  issueDate: Date;

  @ApiProperty()
  dueDate?: Date;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  notes?: string;

  @ApiProperty()
  paymentInstructions?: string;

  @ApiProperty()
  internalNotes?: string;

  @ApiProperty()
  insuranceProvider?: string;

  @ApiProperty()
  insurancePolicyNumber?: string;

  @ApiProperty()
  insuranceCoverageAmount: number;

  @ApiProperty()
  isInsuranceClaim: boolean;

  @ApiProperty()
  paidAt?: Date;

  @ApiProperty()
  cancelledAt?: Date;

  @ApiProperty()
  cancellationReason?: string;

  @ApiProperty()
  refundedAt?: Date;

  @ApiProperty()
  refundReason?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
