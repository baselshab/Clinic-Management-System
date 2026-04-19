import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum StaffRole {
  NURSE = 'nurse',
  RECEPTIONIST = 'receptionist',
  LAB_TECHNICIAN = 'lab_technician',
  PHARMACIST = 'pharmacist',
  ACCOUNTANT = 'accountant',
  ADMIN_ASSISTANT = 'admin_assistant',
  SECURITY = 'security',
  CLEANER = 'cleaner',
  OTHER = 'other',
}

export enum StaffStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
  TERMINATED = 'terminated',
}

export enum ShiftType {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  NIGHT = 'night',
  FLEXIBLE = 'flexible',
}

@Schema({ timestamps: true })
export class Staff extends Document {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @Prop({ required: true, ref: 'User' })
  userId: Types.ObjectId;

  @ApiProperty({ example: 'STF-001' })
  @Prop({ required: true, unique: true })
  staffCode: string;

  @ApiProperty({ enum: StaffRole, example: StaffRole.NURSE })
  @Prop({ type: String, enum: StaffRole, required: true })
  role: StaffRole;

  @ApiProperty({ example: 'Senior Nurse' })
  @Prop()
  position: string;

  @ApiProperty({ example: 'Nursing' })
  @Prop()
  department: string;

  @ApiProperty({ example: 'Jane Smith' })
  @Prop({ required: true })
  fullName: string;

  @ApiProperty({ example: '+1234567890' })
  @Prop({ required: true })
  phone: string;

  @ApiProperty({ example: 'jane.smith@clinic.com' })
  @Prop({ lowercase: true })
  email?: string;

  @ApiProperty({ example: '1995-08-20' })
  @Prop()
  dateOfBirth: Date;

  @ApiProperty({ example: '2020-01-15' })
  @Prop()
  hireDate: Date;

  @ApiPropertyOptional({ example: '2025-12-31' })
  @Prop()
  contractEndDate: Date;

  @ApiProperty({ example: 'Bachelor of Nursing' })
  @Prop()
  education: string;

  @ApiProperty({ example: 'LIC-789' })
  @Prop()
  licenseNumber: string;

  @ApiProperty({ enum: ShiftType, example: ShiftType.MORNING })
  @Prop({ type: String, enum: ShiftType, default: ShiftType.MORNING })
  shift: ShiftType;

  @ApiProperty({ example: '9:00 AM - 5:00 PM' })
  @Prop()
  workingHours: string;

  @ApiProperty({ example: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] })
  @Prop({ type: [String] })
  workingDays: string[];

  @ApiProperty({ example: 5000 })
  @Prop({ min: 0 })
  salary: number;

  @ApiProperty({ example: 'USD' })
  @Prop({ default: 'USD' })
  currency: string;

  @ApiProperty({ example: 'Room 201' })
  @Prop()
  assignedLocation: string;

  @ApiPropertyOptional({ description: 'Doctor ID this staff member assists' })
  @Prop({ ref: 'Doctor' })
  assignedDoctor?: Types.ObjectId;

  @ApiProperty({ example: true })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ enum: StaffStatus, example: StaffStatus.ACTIVE })
  @Prop({ type: String, enum: StaffStatus, default: StaffStatus.ACTIVE })
  status: StaffStatus;

  @ApiProperty()
  @Prop()
  emergencyContactName: string;

  @ApiProperty()
  @Prop()
  emergencyContactPhone: string;

  @ApiProperty()
  @Prop()
  emergencyContactRelation: string;

  @ApiProperty()
  @Prop()
  notes: string;

  @ApiProperty()
  @Prop()
  profileImage: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);

// Indexes
StaffSchema.index({ userId: 1 }, { unique: true });
StaffSchema.index({ staffCode: 1 }, { unique: true });
StaffSchema.index({ role: 1 });
StaffSchema.index({ status: 1 });
StaffSchema.index({ department: 1 });
StaffSchema.index({ assignedDoctor: 1 });
