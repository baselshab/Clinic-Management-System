import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsArray,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DoctorStatus, ConsultationType } from '../schemas/doctor.schema';

export class UpdateDoctorDto {
  @ApiPropertyOptional({ example: 'Cardiology' })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiPropertyOptional({ example: ['Cardiology', 'Internal Medicine'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subSpecialties?: string[];

  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(60)
  yearsOfExperience?: number;

  @ApiPropertyOptional({ example: 'MBBS, MD, FACC' })
  @IsOptional()
  @IsString()
  qualifications?: string;

  @ApiPropertyOptional({ example: 'MED-12345' })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional({ example: '2025-12-31' })
  @IsOptional()
  @IsDateString()
  licenseExpiryDate?: Date;

  @ApiPropertyOptional({ example: 'Dr. John Smith is a board-certified cardiologist...' })
  @IsOptional()
  @IsString()
  biography?: string;

  @ApiPropertyOptional({ example: 200 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  consultationFee?: number;

  @ApiPropertyOptional({ enum: ConsultationType, example: [ConsultationType.IN_PERSON] })
  @IsOptional()
  @IsArray()
  @IsEnum(ConsultationType, { each: true })
  consultationTypes?: ConsultationType[];

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(5)
  @Max(120)
  appointmentDuration?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  maxPatientsPerDay?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({ enum: DoctorStatus, example: DoctorStatus.ACTIVE })
  @IsOptional()
  @IsEnum(DoctorStatus)
  status?: DoctorStatus;

  @ApiPropertyOptional({ example: 'Room 301, Building A' })
  @IsOptional()
  @IsString()
  clinicLocation?: string;

  @ApiPropertyOptional({ example: '3rd Floor' })
  @IsOptional()
  @IsString()
  clinicFloor?: string;

  @ApiPropertyOptional({ example: '9:00 AM - 5:00 PM' })
  @IsOptional()
  @IsString()
  workingHours?: string;

  @ApiPropertyOptional({ example: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  workingDays?: string[];

  @ApiPropertyOptional({ example: ['Board Certified', 'Fellowship'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  @ApiPropertyOptional({ example: 'https://example.com/doctor.jpg' })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ example: ['English', 'Arabic'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];
}
