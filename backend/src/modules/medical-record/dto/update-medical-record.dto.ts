import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDate,
  IsOptional,
  IsArray,
  IsMongoId,
  IsNumber,
  Min,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  RecordStatus,
  VisitType,
  PrescriptionFrequency,
  PrescriptionDuration,
} from '../schemas/medical-record.schema';
import { PrescriptionDto } from './create-medical-record.dto';

export class UpdateMedicalRecordDto {
  @ApiPropertyOptional({ description: 'Patient ID' })
  @IsOptional()
  @IsMongoId()
  patientId?: string;

  @ApiPropertyOptional({ description: 'Doctor ID' })
  @IsOptional()
  @IsMongoId()
  doctorId?: string;

  @ApiPropertyOptional({ description: 'Associated appointment ID' })
  @IsOptional()
  @IsMongoId()
  appointmentId?: string;

  @ApiPropertyOptional({ example: '2024-04-15T10:00:00.000Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  visitDate?: Date;

  @ApiPropertyOptional({ enum: VisitType, example: VisitType.CONSULTATION })
  @IsOptional()
  @IsEnum(VisitType)
  visitType?: VisitType;

  @ApiPropertyOptional({ enum: RecordStatus, example: RecordStatus.FINALIZED })
  @IsOptional()
  @IsEnum(RecordStatus)
  status?: RecordStatus;

  @ApiPropertyOptional({ example: 'Patient complains of persistent headaches' })
  @IsOptional()
  @IsString()
  chiefComplaint?: string;

  @ApiPropertyOptional({ example: 'Patient appears fatigued' })
  @IsOptional()
  @IsString()
  physicalExamination?: string;

  @ApiPropertyOptional({ example: 'BP: 120/80, Temp: 98.6F' })
  @IsOptional()
  @IsString()
  vitalSigns?: string;

  @ApiPropertyOptional({ example: 'Migraine with aura' })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional({ example: 'ICD-10: G43.1' })
  @IsOptional()
  @IsString()
  diagnosisCode?: string;

  @ApiPropertyOptional({ example: 'Differential diagnoses ruled out' })
  @IsOptional()
  @IsString()
  differentialDiagnosis?: string;

  @ApiPropertyOptional({ example: 'Blood tests recommended' })
  @IsOptional()
  @IsString()
  labTestsOrdered?: string;

  @ApiPropertyOptional({ example: 'Blood work normal' })
  @IsOptional()
  @IsString()
  labResults?: string;

  @ApiPropertyOptional({ example: ['Ibuprofen 400mg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  prescribedMedications?: string[];

  @ApiPropertyOptional({ type: [PrescriptionDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PrescriptionDto)
  prescriptions?: PrescriptionDto[];

  @ApiPropertyOptional({ example: ['Rest for 3 days'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  treatmentPlan?: string[];

  @ApiPropertyOptional({ example: 'Refer to neurologist' })
  @IsOptional()
  @IsString()
  referrals?: string;

  @ApiPropertyOptional({ example: 'Return if symptoms worsen' })
  @IsOptional()
  @IsString()
  followUpInstructions?: string;

  @ApiPropertyOptional({ example: '2024-05-01T10:00:00.000Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  followUpDate?: Date;

  @ApiPropertyOptional({ example: 'Additional notes' })
  @IsOptional()
  @IsString()
  doctorNotes?: string;

  @ApiPropertyOptional({ example: ['mri_scan_2024.pdf'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isSensitive?: boolean;

  @ApiPropertyOptional({ example: 'Mental health related' })
  @IsOptional()
  @IsString()
  sensitivityReason?: string;
}
