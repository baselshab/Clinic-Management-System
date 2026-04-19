import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum RecordStatus {
  DRAFT = 'draft',
  FINALIZED = 'finalized',
  AMENDED = 'amended',
  ARCHIVED = 'archived',
}

export enum VisitType {
  CONSULTATION = 'consultation',
  EMERGENCY = 'emergency',
  FOLLOW_UP = 'follow_up',
  PROCEDURE = 'procedure',
  LAB_TEST = 'lab_test',
  IMAGING = 'imaging',
  VACCINATION = 'vaccination',
  CHECK_UP = 'check_up',
}

export enum PrescriptionFrequency {
  ONCE_DAILY = 'once_daily',
  TWICE_DAILY = 'twice_daily',
  THREE_TIMES_DAILY = 'three_times_daily',
  FOUR_TIMES_DAILY = 'four_times_daily',
  AS_NEEDED = 'as_needed',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export enum PrescriptionDuration {
  DAYS = 'days',
  WEEKS = 'weeks',
  MONTHS = 'months',
  UNTIL_FURTHER_NOTICE = 'until_further_notice',
}

@Schema({ timestamps: true })
export class MedicalRecord extends Document {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @Prop({ required: true, ref: 'Patient' })
  patientId: Types.ObjectId;

  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  @Prop({ required: true, ref: 'Doctor' })
  doctorId: Types.ObjectId;

  @ApiProperty({ example: '507f1f77bcf86cd799439013' })
  @Prop({ ref: 'Appointment' })
  appointmentId?: Types.ObjectId;

  @ApiProperty({ example: 'MR-001' })
  @Prop({ required: true, unique: true })
  recordCode: string;

  @ApiProperty({ example: '2024-04-15T10:00:00.000Z' })
  @Prop({ required: true })
  visitDate: Date;

  @ApiProperty({ enum: VisitType, example: VisitType.CONSULTATION })
  @Prop({ type: String, enum: VisitType, required: true })
  visitType: VisitType;

  @ApiProperty({ enum: RecordStatus, example: RecordStatus.FINALIZED })
  @Prop({ type: String, enum: RecordStatus, default: RecordStatus.DRAFT })
  status: RecordStatus;

  @ApiProperty({ example: 'Patient complains of persistent headaches and mild fever' })
  @Prop()
  chiefComplaint?: string;

  @ApiProperty({ example: 'Patient appears fatigued, mild dehydration observed' })
  @Prop()
  physicalExamination?: string;

  @ApiProperty({ example: 'BP: 120/80, Temp: 98.6F, HR: 72 bpm' })
  @Prop()
  vitalSigns?: string;

  @ApiProperty({ example: 'Migraine with aura, Mild dehydration' })
  @Prop()
  diagnosis?: string;

  @ApiProperty({ example: 'ICD-10: G43.1, E86.0' })
  @Prop()
  diagnosisCode?: string;

  @ApiProperty({ example: 'Differential diagnoses ruled out' })
  @Prop()
  differentialDiagnosis?: string;

  @ApiProperty({ example: 'Blood tests, MRI scan recommended' })
  @Prop()
  labTestsOrdered?: string;

  @ApiProperty({ example: 'Blood work normal, MRI shows no abnormalities' })
  @Prop()
  labResults?: string;

  @ApiProperty({ example: 'Ibuprofen 400mg, Paracetamol 500mg' })
  @Prop({ type: [String], default: [] })
  prescribedMedications: string[];

  @ApiProperty({
    example: [
      {
        medication: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'twice_daily',
        duration: 7,
        durationUnit: 'days',
        instructions: 'Take after food',
      },
    ],
  })
  @Prop({
    type: [
      {
        medication: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, enum: PrescriptionFrequency },
        duration: { type: Number },
        durationUnit: { type: String, enum: PrescriptionDuration },
        instructions: { type: String },
      },
    ],
    default: [],
  })
  prescriptions: Array<{
    medication: string;
    dosage: string;
    frequency?: PrescriptionFrequency;
    duration?: number;
    durationUnit?: PrescriptionDuration;
    instructions?: string;
  }>;

  @ApiProperty({ example: ['Rest for 3 days', 'Increase fluid intake', 'Follow-up in 2 weeks'] })
  @Prop({ type: [String], default: [] })
  treatmentPlan: string[];

  @ApiProperty({ example: 'Refer to neurologist if symptoms persist' })
  @Prop()
  referrals?: string;

  @ApiProperty({ example: 'Patient advised to return if symptoms worsen' })
  @Prop()
  followUpInstructions?: string;

  @ApiProperty({ example: '2024-05-01T10:00:00.000Z' })
  @Prop()
  followUpDate?: Date;

  @ApiProperty({ example: 'Additional notes from the doctor about the treatment plan' })
  @Prop()
  doctorNotes?: string;

  @ApiProperty({ example: ['mri_scan_2024.pdf', 'blood_test_results.pdf'] })
  @Prop({ type: [String], default: [] })
  attachments: string[];

  @ApiProperty({ example: false })
  @Prop({ default: false })
  isSensitive: boolean;

  @ApiProperty({ example: 'Mental health related records require additional privacy' })
  @Prop()
  sensitivityReason?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);

// Indexes for efficient queries
MedicalRecordSchema.index({ patientId: 1 });
MedicalRecordSchema.index({ doctorId: 1 });
MedicalRecordSchema.index({ appointmentId: 1 });
MedicalRecordSchema.index({ recordCode: 1 }, { unique: true });
MedicalRecordSchema.index({ visitDate: 1 });
MedicalRecordSchema.index({ status: 1 });
MedicalRecordSchema.index({ visitType: 1 });
MedicalRecordSchema.index({ patientId: 1, visitDate: 1 });
MedicalRecordSchema.index({ patientId: 1, status: 1 });
