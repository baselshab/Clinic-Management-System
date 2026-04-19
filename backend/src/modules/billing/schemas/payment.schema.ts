import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from './invoice.schema';

export { PaymentMethod } from './invoice.schema';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
  REVERSED = 'reversed',
}

@Schema({ timestamps: true })
export class Payment extends Document {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @Prop({ required: true, ref: 'Invoice' })
  invoiceId: Types.ObjectId;

  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  @Prop({ required: true, ref: 'Patient' })
  patientId: Types.ObjectId;

  @ApiProperty({ example: '507f1f77bcf86cd799439013' })
  @Prop({ ref: 'Doctor' })
  doctorId?: Types.ObjectId;

  @ApiProperty({ example: 'PAY-001' })
  @Prop({ required: true, unique: true })
  paymentReference: string;

  @ApiProperty({ example: 150 })
  @Prop({ required: true, min: 0.01 })
  amount: number;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CREDIT_CARD })
  @Prop({ type: String, enum: PaymentMethod, required: true })
  paymentMethod: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.COMPLETED })
  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @ApiProperty({ example: '2024-04-15T10:00:00.000Z' })
  @Prop({ required: true })
  paymentDate: Date;

  @ApiProperty({ example: 'Payment for consultation' })
  @Prop()
  description?: string;

  @ApiProperty({ example: 'Visa ending in 4242' })
  @Prop()
  paymentGateway?: string;

  @ApiProperty({ example: 'ch_3N1234567890' })
  @Prop()
  transactionId?: string;

  @ApiProperty({ example: 'TXN-REF-123456' })
  @Prop()
  referenceNumber?: string;

  @ApiProperty({ example: 'Credit card payment processed successfully' })
  @Prop()
  notes?: string;

  @ApiProperty({ example: 'admin@clinic.com' })
  @Prop()
  processedBy?: string;

  @ApiProperty({ example: 'Payment failed due to insufficient funds' })
  @Prop()
  failureReason?: string;

  @ApiProperty({ example: 'Customer requested refund' })
  @Prop()
  refundReason?: string;

  @ApiProperty({ example: 150 })
  @Prop({ min: 0, default: 0 })
  refundedAmount: number;

  @ApiProperty()
  @Prop()
  refundedAt?: Date;

  @ApiProperty()
  @Prop()
  cancelledAt?: Date;

  @ApiProperty()
  @Prop()
  cancellationReason?: string;

  @ApiProperty({ example: 'USD' })
  @Prop({ default: 'USD' })
  currency: string;

  @ApiProperty({ example: 1 })
  @Prop({ default: 1 })
  exchangeRate: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

// Indexes for efficient queries
PaymentSchema.index({ invoiceId: 1 });
PaymentSchema.index({ patientId: 1 });
PaymentSchema.index({ doctorId: 1 });
PaymentSchema.index({ paymentReference: 1 }, { unique: true });
PaymentSchema.index({ paymentDate: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ paymentMethod: 1 });
PaymentSchema.index({ transactionId: 1 });
PaymentSchema.index({ patientId: 1, paymentDate: 1 });
