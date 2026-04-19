import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDate,
  IsOptional,
  IsArray,
  IsMongoId,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  RecordStatus,
  VisitType,
  PrescriptionFrequency,
  PrescriptionDuration,
} from '../schemas/medical-record.schema';

export class PrescriptionDto {
  @ApiProperty({ example: 'Ibuprofen' })
  @IsString()
  medication: string;

  @ApiProperty({ example: '400mg' })
  @IsString()
  dosage: string;

  @ApiPropertyOptional({ enum: PrescriptionFrequency, example: PrescriptionFrequency.TWICE_DAILY })
  @IsOptional()
  @IsEnum(PrescriptionFrequency)
  frequency?: PrescriptionFrequency;

  @ApiPropertyOptional({ example: 7 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;

  @ApiPropertyOptional({ enum: PrescriptionDuration, example: PrescriptionDuration.DAYS })
  @IsOptional()
  @IsEnum(PrescriptionDuration)
  durationUnit?: PrescriptionDuration;

  @ApiPropertyOptional({ example: 'Take after food' })
  @IsOptional()
  @IsString()
  instructions?: string;
}

export class CreateMedicalRecordDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsMongoId()
  patientId: string;

  @ApiProperty({ description: 'Doctor ID' })
  @IsMongoId()
  doctorId: string;

  @ApiPropertyOptional({ description: 'Associated appointment ID' })
  @IsOptional()
  @IsMongoId()
  appointmentId?: string;

  @ApiProperty({ example: '2024-04-15T10:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  visitDate: Date;

  @ApiProperty({ enum: VisitType, example: VisitType.CONSULTATION })
  @IsEnum(VisitType)
  visitType: VisitType;

  @ApiPropertyOptional({ enum: RecordStatus, example: RecordStatus.DRAFT })
  @IsOptional()
  @IsEnum(RecordStatus)
  status?: RecordStatus;

  @ApiPropertyOptional({ example: 'Patient complains of persistent headaches and mild fever' })
  @IsOptional()
  @IsString()
  chiefComplaint?: string;

  @ApiPropertyOptional({ example: 'Patient appears fatigued, mild dehydration observed' })
  @IsOptional()
  @IsString()
  physicalExamination?: string;

  @ApiPropertyOptional({ example: 'BP: 120/80, Temp: 98.6F, HR: 72 bpm' })
  @IsOptional()
  @IsString()
  vitalSigns?: string;

  @ApiPropertyOptional({ example: 'Migraine with aura, Mild dehydration' })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional({ example: 'ICD-10: G43.1, E86.0' })
  @IsOptional()
  @IsString()
  diagnosisCode?: string;

  @ApiPropertyOptional({ example: 'Differential diagnoses ruled out' })
  @IsOptional()
  @IsString()
  differentialDiagnosis?: string;

  @ApiPropertyOptional({ example: 'Blood tests, MRI scan recommended' })
  @IsOptional()
  @IsString()
  labTestsOrdered?: string;

  @ApiPropertyOptional({ example: 'Blood work normal, MRI shows no abnormalities' })
  @IsOptional()
  @IsString()
  labResults?: string;

  @ApiPropertyOptional({ example: ['Ibuprofen 400mg', 'Paracetamol 500mg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  prescribedMedications?: string[];

  @ApiPropertyOptional({ type: [PrescriptionDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PrescriptionDto)
  prescriptions?: PrescriptionDto[];

  @ApiPropertyOptional({ example: ['Rest for 3 days', 'Increase fluid intake'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  treatmentPlan?: string[];

  @ApiPropertyOptional({ example: 'Refer to neurologist if symptoms persist' })
  @IsOptional()
  @IsString()
  referrals?: string;

  @ApiPropertyOptional({ example: 'Patient advised to return if symptoms worsen' })
  @IsOptional()
  @IsString()
  followUpInstructions?: string;

  @ApiPropertyOptional({ example: '2024-05-01T10:00:00.000Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  followUpDate?: Date;

  @ApiPropertyOptional({ example: 'Additional notes from the doctor' })
  @IsOptional()
  @IsString()
  doctorNotes?: string;

  @ApiPropertyOptional({ example: ['mri_scan_2024.pdf'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  isSensitive?: boolean;

  @ApiPropertyOptional({ example: 'Mental health related records' })
  @IsOptional()
  @IsString()
  sensitivityReason?: string;
}
