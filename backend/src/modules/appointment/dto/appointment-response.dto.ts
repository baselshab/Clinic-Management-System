import { ApiProperty } from '@nestjs/swagger';
import {
  AppointmentType,
  AppointmentStatus,
  AppointmentPriority,
} from '../schemas/appointment.schema';

export class AppointmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  patientId: string;

  @ApiProperty()
  doctorId: string;

  @ApiProperty({ nullable: true })
  receptionistId?: string;

  @ApiProperty({ example: 'APT-001' })
  appointmentCode: string;

  @ApiProperty({ example: '2024-04-15T10:00:00.000Z' })
  scheduledDate: Date;

  @ApiProperty({ example: 30, description: 'Duration in minutes' })
  duration: number;

  @ApiProperty({ enum: AppointmentType })
  appointmentType: AppointmentType;

  @ApiProperty({ enum: AppointmentStatus })
  status: AppointmentStatus;

  @ApiProperty({ enum: AppointmentPriority })
  priority: AppointmentPriority;

  @ApiProperty({ nullable: true })
  reason?: string;

  @ApiProperty({ nullable: true })
  symptoms?: string;

  @ApiProperty({ nullable: true })
  notes?: string;

  @ApiProperty({ nullable: true })
  doctorNotes?: string;

  @ApiProperty({ nullable: true })
  diagnosis?: string;

  @ApiProperty({ type: [String] })
  treatmentPlan: string[];

  @ApiProperty({ nullable: true })
  cancellationReason?: string;

  @ApiProperty({ nullable: true })
  confirmedAt?: Date;

  @ApiProperty({ nullable: true })
  completedAt?: Date;

  @ApiProperty({ nullable: true })
  consultationFee?: number;

  @ApiProperty()
  isFollowUpNeeded: boolean;

  @ApiProperty({ nullable: true })
  followUpDate?: Date;

  @ApiProperty()
  sendReminder: boolean;

  @ApiProperty({ nullable: true })
  location?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
