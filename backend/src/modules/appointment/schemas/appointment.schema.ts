import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum AppointmentType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow_up',
  EMERGENCY = 'emergency',
  CHECK_UP = 'check_up',
  PROCEDURE = 'procedure',
}

export enum AppointmentPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Schema({ timestamps: true })
export class Appointment extends Document {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @Prop({ required: true, ref: 'Patient' })
  patientId: Types.ObjectId;

  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  @Prop({ required: true, ref: 'Doctor' })
  doctorId: Types.ObjectId;

  @ApiProperty({ example: '507f1f77bcf86cd799439013' })
  @Prop({ ref: 'Staff' })
  receptionistId?: Types.ObjectId;

  @ApiProperty({ example: 'APT-001' })
  @Prop({ required: true, unique: true })
  appointmentCode: string;

  @ApiProperty({ example: '2024-04-15T10:00:00.000Z' })
  @Prop({ required: true })
  scheduledDate: Date;

  @ApiProperty({ example: 30, description: 'Duration in minutes' })
  @Prop({ required: true, min: 15, max: 240 })
  duration: number;

  @ApiProperty({ enum: AppointmentType, example: AppointmentType.CONSULTATION })
  @Prop({ type: String, enum: AppointmentType, required: true })
  appointmentType: AppointmentType;

  @ApiProperty({ enum: AppointmentStatus, example: AppointmentStatus.PENDING })
  @Prop({ type: String, enum: AppointmentStatus, default: AppointmentStatus.PENDING })
  status: AppointmentStatus;

  @ApiProperty({ enum: AppointmentPriority, example: AppointmentPriority.NORMAL })
  @Prop({ type: String, enum: AppointmentPriority, default: AppointmentPriority.NORMAL })
  priority: AppointmentPriority;

  @ApiProperty({ example: 'Regular check-up consultation' })
  @Prop({ trim: true })
  reason?: string;

  @ApiProperty({ example: 'Patient reports mild headaches' })
  @Prop()
  symptoms?: string;

  @ApiProperty({ example: 'Follow-up appointment needed' })
  @Prop()
  notes?: string;

  @ApiProperty({ example: 'Dr. Smith will handle this case' })
  @Prop()
  doctorNotes?: string;

  @ApiProperty({ example: 'Diagnosis and treatment plan' })
  @Prop()
  diagnosis?: string;

  @ApiProperty({ example: ['Prescription A', 'Rest for 3 days'] })
  @Prop({ type: [String], default: [] })
  treatmentPlan: string[];

  @ApiPropertyOptional()
  @Prop()
  cancellationReason?: string;

  @ApiPropertyOptional()
  @Prop()
  cancelledBy?: Types.ObjectId;

  @ApiPropertyOptional()
  @Prop()
  cancelledAt?: Date;

  @ApiPropertyOptional()
  @Prop()
  confirmedAt?: Date;

  @ApiPropertyOptional()
  @Prop()
  completedAt?: Date;

  @ApiPropertyOptional()
  @Prop()
  noShowReason?: string;

  @ApiProperty({ example: 150, description: 'Consultation fee' })
  @Prop({ min: 0 })
  consultationFee?: number;

  @ApiProperty({ example: false })
  @Prop({ default: false })
  isFollowUpNeeded: boolean;

  @ApiPropertyOptional()
  @Prop()
  followUpDate?: Date;

  @ApiProperty({ example: true })
  @Prop({ default: true })
  sendReminder: boolean;

  @ApiPropertyOptional()
  @Prop()
  reminderSentAt?: Date;

  @ApiProperty({ example: 'Room 301' })
  @Prop()
  location?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

// Indexes for efficient queries
AppointmentSchema.index({ patientId: 1 });
AppointmentSchema.index({ doctorId: 1 });
AppointmentSchema.index({ scheduledDate: 1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ appointmentCode: 1 }, { unique: true });
AppointmentSchema.index({ doctorId: 1, scheduledDate: 1 });
AppointmentSchema.index({ patientId: 1, scheduledDate: 1 });
