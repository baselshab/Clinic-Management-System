import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

@Schema({ timestamps: true })
export class Patient extends Document {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @Prop({ required: true, ref: 'User' })
  userId: Types.ObjectId;

  @ApiProperty({ example: 'PAT-001' })
  @Prop({ required: true, unique: true })
  patientCode: string;

  @ApiProperty({ example: 'John' })
  @Prop({ required: true, trim: true })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @Prop({ required: true, trim: true })
  lastName: string;

  @ApiProperty({ example: '1990-05-15' })
  @Prop({ required: true })
  dateOfBirth: Date;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @Prop({ type: String, enum: Gender, required: true })
  gender: Gender;

  @ApiProperty({ example: '+1234567890' })
  @Prop({ trim: true })
  phone?: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @Prop({ lowercase: true, trim: true })
  email?: string;

  @ApiProperty({ example: '123 Main St, City, State' })
  @Prop()
  address?: string;

  @ApiProperty({ example: 'New York' })
  @Prop()
  city?: string;

  @ApiProperty({ example: 'US' })
  @Prop()
  country?: string;

  @ApiProperty({ example: '10001' })
  @Prop()
  postalCode?: string;

  @ApiProperty({ enum: BloodType, example: BloodType.O_POSITIVE })
  @Prop({ type: String, enum: BloodType })
  bloodType?: BloodType;

  @ApiProperty({ example: '175' })
  @Prop()
  height?: number;

  @ApiProperty({ example: '70' })
  @Prop()
  weight?: number;

  @ApiProperty({ example: ['Diabetes', 'Hypertension'] })
  @Prop({ type: [String], default: [] })
  allergies: string[];

  @ApiProperty({ example: ['Diabetes in family'] })
  @Prop({ type: [String], default: [] })
  familyHistory: string[];

  @ApiProperty({ example: ['Metformin 500mg'] })
  @Prop({ type: [String], default: [] })
  currentMedications: string[];

  @ApiPropertyOptional()
  @Prop()
  emergencyContactName?: string;

  @ApiPropertyOptional()
  @Prop()
  emergencyContactPhone?: string;

  @ApiPropertyOptional()
  @Prop()
  emergencyContactRelation?: string;

  @ApiProperty({ example: true })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty()
  @Prop()
  notes?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);

// Indexes for efficient queries
PatientSchema.index({ userId: 1 }, { unique: true });
PatientSchema.index({ patientCode: 1 }, { unique: true });
PatientSchema.index({ email: 1 });
PatientSchema.index({ phone: 1 });
PatientSchema.index({ firstName: 1, lastName: 1 });
