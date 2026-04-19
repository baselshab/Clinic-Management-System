import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus, PaymentMethod } from '../schemas/payment.schema';

export class PaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  invoiceId: string;

  @ApiProperty()
  patientId: string;

  @ApiProperty()
  doctorId?: string;

  @ApiProperty()
  paymentReference: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  paymentMethod: PaymentMethod;

  @ApiProperty()
  status: PaymentStatus;

  @ApiProperty()
  paymentDate: Date;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  paymentGateway?: string;

  @ApiProperty()
  transactionId?: string;

  @ApiProperty()
  referenceNumber?: string;

  @ApiProperty()
  notes?: string;

  @ApiProperty()
  processedBy?: string;

  @ApiProperty()
  failureReason?: string;

  @ApiProperty()
  refundReason?: string;

  @ApiProperty()
  refundedAmount: number;

  @ApiProperty()
  refundedAt?: Date;

  @ApiProperty()
  cancelledAt?: Date;

  @ApiProperty()
  cancellationReason?: string;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  exchangeRate: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
