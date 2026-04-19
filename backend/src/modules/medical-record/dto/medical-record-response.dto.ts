import { ApiProperty } from '@nestjs/swagger';
import {
  RecordStatus,
  VisitType,
  PrescriptionFrequency,
  PrescriptionDuration,
} from '../schemas/medical-record.schema';

export class PrescriptionResponseDto {
  @ApiProperty()
  medication: string;

  @ApiProperty()
  dosage: string;

  @ApiProperty()
  frequency?: PrescriptionFrequency;

  @ApiProperty()
  duration?: number;

  @ApiProperty()
  durationUnit?: PrescriptionDuration;

  @ApiProperty()
  instructions?: string;
}

export class MedicalRecordResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  patientId: string;

  @ApiProperty()
  doctorId: string;

  @ApiProperty()
  appointmentId?: string;

  @ApiProperty()
  recordCode: string;

  @ApiProperty()
  visitDate: Date;

  @ApiProperty()
  visitType: VisitType;

  @ApiProperty()
  status: RecordStatus;

  @ApiProperty()
  chiefComplaint?: string;

  @ApiProperty()
  physicalExamination?: string;

  @ApiProperty()
  vitalSigns?: string;

  @ApiProperty()
  diagnosis?: string;

  @ApiProperty()
  diagnosisCode?: string;

  @ApiProperty()
  differentialDiagnosis?: string;

  @ApiProperty()
  labTestsOrdered?: string;

  @ApiProperty()
  labResults?: string;

  @ApiProperty()
  prescribedMedications: string[];

  @ApiProperty({ type: [PrescriptionResponseDto] })
  prescriptions: PrescriptionResponseDto[];

  @ApiProperty()
  treatmentPlan: string[];

  @ApiProperty()
  referrals?: string;

  @ApiProperty()
  followUpInstructions?: string;

  @ApiProperty()
  followUpDate?: Date;

  @ApiProperty()
  doctorNotes?: string;

  @ApiProperty()
  attachments: string[];

  @ApiProperty()
  isSensitive: boolean;

  @ApiProperty()
  sensitivityReason?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
