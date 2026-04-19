import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum DoctorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
}

export enum ConsultationType {
  IN_PERSON = 'in_person',
  VIDEO_CALL = 'video_call',
  PHONE_CALL = 'phone_call',
}

@Schema({ timestamps: true })
export class Doctor extends Document {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @Prop({ required: true, ref: 'User' })
  userId: Types.ObjectId;

  @ApiProperty({ example: 'DOC-001' })
  @Prop({ required: true, unique: true })
  doctorCode: string;

  @ApiProperty({ example: 'Cardiology' })
  @Prop({ required: true })
  specialization: string;

  @ApiProperty({ example: ['Cardiology', 'Internal Medicine'] })
  @Prop({ type: [String], default: [] })
  subSpecialties: string[];

  @ApiProperty({ example: 15 })
  @Prop({ min: 0 })
  yearsOfExperience: number;

  @ApiProperty({ example: 'MBBS, MD, FACC' })
  @Prop()
  qualifications: string;

  @ApiProperty({ example: 'MED-12345' })
  @Prop({ unique: true })
  licenseNumber: string;

  @ApiProperty({ example: new Date() })
  @Prop()
  licenseExpiryDate: Date;

  @ApiProperty({ example: 'Dr. John Smith is a board-certified cardiologist...' })
  @Prop()
  biography: string;

  @ApiProperty({ example: 200 })
  @Prop({ min: 0 })
  consultationFee: number;

  @ApiProperty({ enum: ConsultationType, example: [ConsultationType.IN_PERSON, ConsultationType.VIDEO_CALL] })
  @Prop({ type: [String], enum: ConsultationType })
  consultationTypes: ConsultationType[];

  @ApiProperty({ example: 30 })
  @Prop({ min: 5, max: 120 })
  appointmentDuration: number;

  @ApiProperty({ example: 10 })
  @Prop({ min: 0 })
  maxPatientsPerDay: number;

  @ApiProperty({ example: true })
  @Prop({ default: true })
  isAvailable: boolean;

  @ApiProperty({ enum: DoctorStatus, example: DoctorStatus.ACTIVE })
  @Prop({ type: String, enum: DoctorStatus, default: DoctorStatus.ACTIVE })
  status: DoctorStatus;

  @ApiProperty({ example: 'Room 301, Building A' })
  @Prop()
  clinicLocation: string;

  @ApiProperty({ example: '3rd Floor' })
  @Prop()
  clinicFloor?: string;

  @ApiProperty({ example: '9:00 AM - 5:00 PM' })
  @Prop()
  workingHours: string;

  @ApiProperty({ example: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'] })
  @Prop({ type: [String] })
  workingDays: string[];

  @ApiProperty()
  @Prop({ type: [String], default: [] })
  certifications: string[];

  @ApiProperty({ example: 'https://example.com/doctor.jpg' })
  @Prop()
  profileImage?: string;

  @ApiProperty()
  @Prop({ default: 0 })
  rating: number;

  @ApiProperty()
  @Prop({ default: 0 })
  totalReviews: number;

  @ApiProperty()
  @Prop({ type: [String], default: [] })
  languages: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);

// Indexes
DoctorSchema.index({ userId: 1 }, { unique: true });
DoctorSchema.index({ doctorCode: 1 }, { unique: true });
DoctorSchema.index({ licenseNumber: 1 }, { unique: true });
DoctorSchema.index({ specialization: 1 });
DoctorSchema.index({ status: 1 });
