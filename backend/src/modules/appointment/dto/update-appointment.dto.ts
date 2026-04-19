import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDate,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsMongoId,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AppointmentType,
  AppointmentStatus,
  AppointmentPriority,
} from '../schemas/appointment.schema';

export class UpdateAppointmentDto {
  @ApiPropertyOptional({ description: 'Patient ID' })
  @IsOptional()
  @IsMongoId()
  patientId?: string;

  @ApiPropertyOptional({ description: 'Doctor ID' })
  @IsOptional()
  @IsMongoId()
  doctorId?: string;

  @ApiPropertyOptional({ example: '2024-04-15T10:00:00.000Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduledDate?: Date;

  @ApiPropertyOptional({ example: 30, description: 'Duration in minutes' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(15)
  @Max(240)
  duration?: number;

  @ApiPropertyOptional({ enum: AppointmentType })
  @IsOptional()
  @IsEnum(AppointmentType)
  appointmentType?: AppointmentType;

  @ApiPropertyOptional({ enum: AppointmentStatus })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiPropertyOptional({ enum: AppointmentPriority })
  @IsOptional()
  @IsEnum(AppointmentPriority)
  priority?: AppointmentPriority;

  @ApiPropertyOptional({ example: 'Regular check-up consultation' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ example: 'Patient reports mild headaches' })
  @IsOptional()
  @IsString()
  symptoms?: string;

  @ApiPropertyOptional({ example: 'Follow-up appointment needed' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'Dr. Smith will handle this case' })
  @IsOptional()
  @IsString()
  doctorNotes?: string;

  @ApiPropertyOptional({ example: 'Diagnosis and treatment plan' })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional({ example: ['Prescription A', 'Rest for 3 days'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  treatmentPlan?: string[];

  @ApiPropertyOptional({ example: 'Patient requested cancellation' })
  @IsOptional()
  @IsString()
  cancellationReason?: string;

  @ApiPropertyOptional({ example: 'No show - patient did not arrive' })
  @IsOptional()
  @IsString()
  noShowReason?: string;

  @ApiPropertyOptional({ example: 150, description: 'Consultation fee' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  consultationFee?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isFollowUpNeeded?: boolean;

  @ApiPropertyOptional({ example: '2024-04-22T10:00:00.000Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  followUpDate?: Date;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  sendReminder?: boolean;

  @ApiPropertyOptional({ example: 'Room 301' })
  @IsOptional()
  @IsString()
  location?: string;

  // Timestamps for status changes (set internally, not via API)
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  confirmedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  completedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  cancelledAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  cancelledBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  reminderSentAt?: Date;
}
