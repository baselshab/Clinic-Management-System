import { ApiProperty } from '@nestjs/swagger';
import { Gender, BloodType } from '../schemas/patient.schema';

export class PatientResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  patientCode: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty()
  gender: Gender;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  address?: string;

  @ApiProperty()
  city?: string;

  @ApiProperty()
  country?: string;

  @ApiProperty()
  postalCode?: string;

  @ApiProperty()
  bloodType?: BloodType;

  @ApiProperty()
  height?: number;

  @ApiProperty()
  weight?: number;

  @ApiProperty()
  allergies: string[];

  @ApiProperty()
  familyHistory: string[];

  @ApiProperty()
  currentMedications: string[];

  @ApiProperty()
  emergencyContactName?: string;

  @ApiProperty()
  emergencyContactPhone?: string;

  @ApiProperty()
  emergencyContactRelation?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  notes?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
