import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  IsMongoId,
  IsDateString,
  IsEmail,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StaffRole, StaffStatus, ShiftType } from '../schemas/staff.schema';

export class CreateStaffDto {
  @ApiProperty({ description: 'User ID associated with this staff member' })
  @IsMongoId()
  userId: string;

  @ApiProperty({ enum: StaffRole, example: StaffRole.NURSE })
  @IsEnum(StaffRole)
  role: StaffRole;

  @ApiProperty({ example: 'Senior Nurse' })
  @IsString()
  position: string;

  @ApiProperty({ example: 'Nursing' })
  @IsString()
  department: string;

  @ApiProperty({ example: 'Jane Smith' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ example: 'jane.smith@clinic.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '1995-08-20' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @ApiPropertyOptional({ example: '2020-01-15' })
  @IsOptional()
  @IsDateString()
  hireDate?: Date;

  @ApiPropertyOptional({ example: '2025-12-31' })
  @IsOptional()
  @IsDateString()
  contractEndDate?: Date;

  @ApiPropertyOptional({ example: 'Bachelor of Nursing' })
  @IsOptional()
  @IsString()
  education?: string;

  @ApiPropertyOptional({ example: 'LIC-789' })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional({ enum: ShiftType, example: ShiftType.MORNING })
  @IsOptional()
  @IsEnum(ShiftType)
  shift?: ShiftType;

  @ApiPropertyOptional({ example: '9:00 AM - 5:00 PM' })
  @IsOptional()
  @IsString()
  workingHours?: string;

  @ApiPropertyOptional({ example: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  workingDays?: string[];

  @ApiPropertyOptional({ example: 5000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salary?: number;

  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: 'Room 201' })
  @IsOptional()
  @IsString()
  assignedLocation?: string;

  @ApiPropertyOptional({ description: 'Doctor ID this staff member assists' })
  @IsOptional()
  @IsMongoId()
  assignedDoctor?: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @ApiPropertyOptional({ example: '+1234567891' })
  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @ApiPropertyOptional({ example: 'Spouse' })
  @IsOptional()
  @IsString()
  emergencyContactRelation?: string;

  @ApiPropertyOptional({ example: 'Staff notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'https://example.com/profile.jpg' })
  @IsOptional()
  @IsString()
  profileImage?: string;
}
