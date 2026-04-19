import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AppointmentType,
  AppointmentStatus,
  AppointmentPriority,
} from '../schemas/appointment.schema';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsMongoId()
  patientId: string;

  @ApiProperty({ description: 'Doctor ID' })
  @IsMongoId()
  doctorId: string;

  @ApiProperty({ description: 'Receptionist ID (optional)' })
  @IsOptional()
  @IsMongoId()
  receptionistId?: string;

  @ApiProperty({ example: '2024-04-15T10:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  scheduledDate: Date;

  @ApiProperty({ example: 30, description: 'Duration in minutes' })
  @Type(() => Number)
  @IsNumber()
  @Min(15)
  @Max(240)
  duration: number;

  @ApiProperty({ enum: AppointmentType, example: AppointmentType.CONSULTATION })
  @IsEnum(AppointmentType)
  appointmentType: AppointmentType;

  @ApiProperty({ enum: AppointmentStatus, example: AppointmentStatus.PENDING })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiProperty({ enum: AppointmentPriority, example: AppointmentPriority.NORMAL })
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

  @ApiPropertyOptional({ example: 'Dr. Smith will handle this case' })
  @IsOptional()
  @IsString()
  doctorNotes?: string;

  @ApiPropertyOptional({ example: 'Patient requested cancellation' })
  @IsOptional()
  @IsString()
  cancellationReason?: string;

  @ApiPropertyOptional({ example: 'Diagnosis and treatment plan' })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional({ example: ['Prescription A', 'Rest for 3 days'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  treatmentPlan?: string[];

  @ApiPropertyOptional({ example: 'No show - patient did not arrive' })
  @IsOptional()
  @IsString()
  noShowReason?: string;
}
