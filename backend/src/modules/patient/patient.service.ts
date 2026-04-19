import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Patient } from './schemas/patient.schema';
import { CreatePatientDto, UpdatePatientDto } from './dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
  ) {}

  private generatePatientCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `PAT-${timestamp}${random}`;
  }

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    // Check if user already has a patient record
    const existingPatient = await this.patientModel.findOne({
      userId: createPatientDto.userId,
    });
    if (existingPatient) {
      throw new ConflictException('User already has a patient record');
    }

    const patientCode = this.generatePatientCode();
    
    const createdPatient = new this.patientModel({
      ...createPatientDto,
      patientCode,
      userId: new Types.ObjectId(createPatientDto.userId),
    });

    return createdPatient.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    gender?: string,
    bloodType?: string,
  ): Promise<{ patients: Patient[]; total: number; page: number; totalPages: number }> {
    const query: any = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { patientCode: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    if (gender) {
      query.gender = gender;
    }

    if (bloodType) {
      query.bloodType = bloodType;
    }

    const skip = (page - 1) * limit;
    const [patients, total] = await Promise.all([
      this.patientModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.patientModel.countDocuments(query),
    ]);

    return {
      patients,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Patient> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid patient ID');
    }

    const patient = await this.patientModel.findById(id);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  async findByUserId(userId: string): Promise<Patient | null> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    return this.patientModel.findOne({ userId: new Types.ObjectId(userId) });
  }

  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid patient ID');
    }

    const patient = await this.patientModel.findByIdAndUpdate(
      id,
      { $set: updatePatientDto },
      { new: true, runValidators: true },
    );

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid patient ID');
    }

    const patient = await this.patientModel.findByIdAndDelete(id);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
  }

  async count(): Promise<number> {
    return this.patientModel.countDocuments();
  }

  async getStatistics(): Promise<{
    total: number;
    active: number;
    byGender: Array<{ _id: string; count: number }>;
    byBloodType: Array<{ _id: string; count: number }>;
  }> {
    const total = await this.patientModel.countDocuments();
    const active = await this.patientModel.countDocuments({ isActive: true });

    const byGender = await this.patientModel.aggregate([
      { $group: { _id: '$gender', count: { $sum: 1 } } },
    ]);

    const byBloodType = await this.patientModel.aggregate([
      { $group: { _id: '$bloodType', count: { $sum: 1 } } },
    ]);

    return { total, active, byGender, byBloodType };
  }
}
