import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Doctor, DoctorStatus } from './schemas/doctor.schema';
import { CreateDoctorDto, UpdateDoctorDto } from './dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
  ) {}

  private generateDoctorCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `DOC-${timestamp}${random}`;
  }

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    // Check if user already has a doctor record
    const existingDoctor = await this.doctorModel.findOne({
      userId: createDoctorDto.userId,
    });
    if (existingDoctor) {
      throw new ConflictException('User already has a doctor record');
    }

    // Check if license number already exists
    const existingLicense = await this.doctorModel.findOne({
      licenseNumber: createDoctorDto.licenseNumber,
    });
    if (existingLicense) {
      throw new ConflictException('License number already exists');
    }

    const doctorCode = this.generateDoctorCode();
    
    const createdDoctor = new this.doctorModel({
      ...createDoctorDto,
      doctorCode,
      userId: new Types.ObjectId(createDoctorDto.userId),
    });

    return createdDoctor.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    specialization?: string,
    status?: DoctorStatus,
    isAvailable?: boolean,
  ): Promise<{ doctors: Doctor[]; total: number; page: number; totalPages: number }> {
    const query: any = {};

    if (search) {
      query.$or = [
        { doctorCode: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { qualifications: { $regex: search, $options: 'i' } },
      ];
    }

    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    if (status) {
      query.status = status;
    }

    if (typeof isAvailable === 'boolean') {
      query.isAvailable = isAvailable;
    }

    const skip = (page - 1) * limit;
    const [doctors, total] = await Promise.all([
      this.doctorModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.doctorModel.countDocuments(query),
    ]);

    return {
      doctors,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Doctor> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid doctor ID');
    }

    const doctor = await this.doctorModel.findById(id);
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }

  async findByUserId(userId: string): Promise<Doctor | null> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    return this.doctorModel.findOne({ userId: new Types.ObjectId(userId) });
  }

  async findBySpecialization(
    specialization: string,
    page = 1,
    limit = 10,
  ): Promise<{ doctors: Doctor[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const [doctors, total] = await Promise.all([
      this.doctorModel
        .find({
          specialization: { $regex: specialization, $options: 'i' },
          status: DoctorStatus.ACTIVE,
          isAvailable: true,
        })
        .skip(skip)
        .limit(limit)
        .sort({ rating: -1 }),
      this.doctorModel.countDocuments({
        specialization: { $regex: specialization, $options: 'i' },
        status: DoctorStatus.ACTIVE,
        isAvailable: true,
      }),
    ]);

    return {
      doctors,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid doctor ID');
    }

    // Check license number uniqueness if being updated
    if (updateDoctorDto.licenseNumber) {
      const existingDoctor = await this.doctorModel.findOne({
        licenseNumber: updateDoctorDto.licenseNumber,
        _id: { $ne: id },
      });
      if (existingDoctor) {
        throw new ConflictException('License number already exists');
      }
    }

    const doctor = await this.doctorModel.findByIdAndUpdate(
      id,
      { $set: updateDoctorDto },
      { new: true, runValidators: true },
    );

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid doctor ID');
    }

    const doctor = await this.doctorModel.findByIdAndDelete(id);
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
  }

  async count(): Promise<number> {
    return this.doctorModel.countDocuments();
  }

  async getStatistics(): Promise<{
    total: number;
    active: number;
    onLeave: number;
    bySpecialization: Array<{ _id: string; count: number }>;
    averageRating: number;
  }> {
    const total = await this.doctorModel.countDocuments();
    const active = await this.doctorModel.countDocuments({ status: DoctorStatus.ACTIVE });
    const onLeave = await this.doctorModel.countDocuments({ status: DoctorStatus.ON_LEAVE });

    const bySpecialization = await this.doctorModel.aggregate([
      { $group: { _id: '$specialization', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const ratingStats = await this.doctorModel.aggregate([
      { $match: { rating: { $gt: 0 } } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } },
    ]);

    return {
      total,
      active,
      onLeave,
      bySpecialization,
      averageRating: ratingStats[0]?.averageRating || 0,
    };
  }
}
