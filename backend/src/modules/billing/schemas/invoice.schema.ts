import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  SENT = 'sent',
  PARTIALLY_PAID = 'partially_paid',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum InvoiceType {
  CONSULTATION = 'consultation',
  PROCEDURE = 'procedure',
  LAB_TEST = 'lab_test',
  MEDICATION = 'medication',
  FOLLOW_UP = 'follow_up',
  EMERGENCY = 'emergency',
  ANNUAL_CHECKUP = 'annual_checkup',
  OTHER = 'other',
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  INSURANCE = 'insurance',
  MOBILE_PAYMENT = 'mobile_payment',
  CHECK = 'check',
}

@Schema({ timestamps: true })
export class Invoice extends Document {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @Prop({ required: true, ref: 'Patient' })
  patientId: Types.ObjectId;

  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  @Prop({ ref: 'Doctor' })
  doctorId?: Types.ObjectId;

  @ApiProperty({ example: '507f1f77bcf86cd799439013' })
  @Prop({ ref: 'Appointment' })
  appointmentId?: Types.ObjectId;

  @ApiProperty({ example: '507f1f77bcf86cd799439014' })
  @Prop({ ref: 'MedicalRecord' })
  medicalRecordId?: Types.ObjectId;

  @ApiProperty({ example: 'INV-001' })
  @Prop({ required: true, unique: true })
  invoiceNumber: string;

  @ApiProperty({ enum: InvoiceType, example: InvoiceType.CONSULTATION })
  @Prop({ type: String, enum: InvoiceType, required: true })
  invoiceType: InvoiceType;

  @ApiProperty({ enum: InvoiceStatus, example: InvoiceStatus.PENDING })
  @Prop({ type: String, enum: InvoiceStatus, default: InvoiceStatus.DRAFT })
  status: InvoiceStatus;

  @ApiProperty({
    example: [
      {
        description: 'Consultation fee',
        quantity: 1,
        unitPrice: 150,
        amount: 150,
      },
    ],
  })
  @Prop({
    type: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        unitPrice: { type: Number, required: true },
        amount: { type: Number, required: true },
      },
    ],
    default: [],
  })
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;

  @ApiProperty({ example: 150 })
  @Prop({ required: true, min: 0 })
  subtotal: number;

  @ApiProperty({ example: 10, description: 'Discount percentage' })
  @Prop({ min: 0, max: 100, default: 0 })
  discountPercent: number;

  @ApiProperty({ example: 15 })
  @Prop({ min: 0, default: 0 })
  discountAmount: number;

  @ApiProperty({ example: 10, description: 'Tax percentage' })
  @Prop({ min: 0, max: 100, default: 0 })
  taxPercent: number;

  @ApiProperty({ example: 13.5 })
  @Prop({ min: 0, default: 0 })
  taxAmount: number;

  @ApiProperty({ example: 148.5 })
  @Prop({ required: true, min: 0 })
  totalAmount: number;

  @ApiProperty({ example: 0 })
  @Prop({ min: 0, default: 0 })
  paidAmount: number;

  @ApiProperty({ example: 148.5 })
  @Prop({ min: 0 })
  balanceAmount: number;

  @ApiProperty({ example: '2024-04-15T10:00:00.000Z' })
  @Prop({ required: true })
  issueDate: Date;

  @ApiProperty({ example: '2024-05-15T10:00:00.000Z' })
  @Prop()
  dueDate?: Date;

  @ApiProperty({ example: 'Payment for consultation services' })
  @Prop()
  description?: string;

  @ApiProperty({ example: 'Late payment will incur 2% monthly interest' })
  @Prop()
  notes?: string;

  @ApiProperty({ example: 'Bank transfer to Account #1234567890' })
  @Prop()
  paymentInstructions?: string;

  @ApiProperty({ example: 'Insurance claim pending' })
  @Prop()
  internalNotes?: string;

  @ApiProperty({ example: 'Blue Cross Insurance' })
  @Prop()
  insuranceProvider?: string;

  @ApiProperty({ example: 'INS-987654' })
  @Prop()
  insurancePolicyNumber?: string;

  @ApiProperty({ example: 100 })
  @Prop({ min: 0, default: 0 })
  insuranceCoverageAmount: number;

  @ApiProperty({ example: false })
  @Prop({ default: false })
  isInsuranceClaim: boolean;

  @ApiProperty()
  @Prop()
  paidAt?: Date;

  @ApiProperty()
  @Prop()
  cancelledAt?: Date;

  @ApiProperty()
  @Prop()
  cancellationReason?: string;

  @ApiProperty({ example: '2024-05-20T10:00:00.000Z' })
  @Prop()
  refundedAt?: Date;

  @ApiProperty()
  @Prop()
  refundReason?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

// Indexes for efficient queries
InvoiceSchema.index({ patientId: 1 });
InvoiceSchema.index({ doctorId: 1 });
InvoiceSchema.index({ appointmentId: 1 });
InvoiceSchema.index({ medicalRecordId: 1 });
InvoiceSchema.index({ invoiceNumber: 1 }, { unique: true });
InvoiceSchema.index({ status: 1 });
InvoiceSchema.index({ issueDate: 1 });
InvoiceSchema.index({ dueDate: 1 });
InvoiceSchema.index({ patientId: 1, status: 1 });
InvoiceSchema.index({ patientId: 1, issueDate: 1 });
