import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MedicalRecord } from './schemas/medical-record.schema';
import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from './dto';

@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectModel(MedicalRecord.name)
    private medicalRecordModel: Model<MedicalRecord>,
  ) {}

  private generateRecordCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `MR-${timestamp}${random}`;
  }

  async create(
    createMedicalRecordDto: CreateMedicalRecordDto,
  ): Promise<MedicalRecord> {
    const recordCode = this.generateRecordCode();

    const createdRecord = new this.medicalRecordModel({
      ...createMedicalRecordDto,
      recordCode,
      patientId: new Types.ObjectId(createMedicalRecordDto.patientId),
      doctorId: new Types.ObjectId(createMedicalRecordDto.doctorId),
      appointmentId: createMedicalRecordDto.appointmentId
        ? new Types.ObjectId(createMedicalRecordDto.appointmentId)
        : undefined,
    });

    return createdRecord.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    patientId?: string,
    doctorId?: string,
    status?: string,
    visitType?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<{
    records: MedicalRecord[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const query: any = {};

    if (search) {
      query.$or = [
        { recordCode: { $regex: search, $options: 'i' } },
        { diagnosis: { $regex: search, $options: 'i' } },
        { chiefComplaint: { $regex: search, $options: 'i' } },
        { diagnosisCode: { $regex: search, $options: 'i' } },
      ];
    }

    if (patientId) {
      if (!Types.ObjectId.isValid(patientId)) {
        throw new BadRequestException('Invalid patient ID');
      }
      query.patientId = new Types.ObjectId(patientId);
    }

    if (doctorId) {
      if (!Types.ObjectId.isValid(doctorId)) {
        throw new BadRequestException('Invalid doctor ID');
      }
      query.doctorId = new Types.ObjectId(doctorId);
    }

    if (status) {
      query.status = status;
    }

    if (visitType) {
      query.visitType = visitType;
    }

    if (startDate || endDate) {
      query.visitDate = {};
      if (startDate) {
        query.visitDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.visitDate.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;
    const [records, total] = await Promise.all([
      this.medicalRecordModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ visitDate: -1 })
        .populate('patientId', 'firstName lastName patientCode')
        .populate('doctorId', 'doctorCode specialization'),
      this.medicalRecordModel.countDocuments(query),
    ]);

    return {
      records,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<MedicalRecord> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid medical record ID');
    }

    const record = await this.medicalRecordModel
      .findById(id)
      .populate('patientId', 'firstName lastName patientCode dateOfBirth gender')
      .populate('doctorId', 'doctorCode specialization name');

    if (!record) {
      throw new NotFoundException('Medical record not found');
    }

    return record;
  }

  async findByPatientId(patientId: string): Promise<MedicalRecord[]> {
    if (!Types.ObjectId.isValid(patientId)) {
      throw new BadRequestException('Invalid patient ID');
    }

    return this.medicalRecordModel
      .find({ patientId: new Types.ObjectId(patientId) })
      .sort({ visitDate: -1 })
      .populate('doctorId', 'doctorCode specialization');
  }

  async findByDoctorId(doctorId: string): Promise<MedicalRecord[]> {
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new BadRequestException('Invalid doctor ID');
    }

    return this.medicalRecordModel
      .find({ doctorId: new Types.ObjectId(doctorId) })
      .sort({ visitDate: -1 })
      .populate('patientId', 'firstName lastName patientCode');
  }

  async findByAppointmentId(
    appointmentId: string,
  ): Promise<MedicalRecord | null> {
    if (!Types.ObjectId.isValid(appointmentId)) {
      throw new BadRequestException('Invalid appointment ID');
    }

    return this.medicalRecordModel.findOne({
      appointmentId: new Types.ObjectId(appointmentId),
    });
  }

  async update(
    id: string,
    updateMedicalRecordDto: UpdateMedicalRecordDto,
  ): Promise<MedicalRecord> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid medical record ID');
    }

    const updateData: any = { ...updateMedicalRecordDto };

    if (updateData.patientId) {
      updateData.patientId = new Types.ObjectId(updateData.patientId);
    }
    if (updateData.doctorId) {
      updateData.doctorId = new Types.ObjectId(updateData.doctorId);
    }
    if (updateData.appointmentId) {
      updateData.appointmentId = new Types.ObjectId(updateData.appointmentId);
    }

    const record = await this.medicalRecordModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!record) {
      throw new NotFoundException('Medical record not found');
    }

    return record;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid medical record ID');
    }

    const record = await this.medicalRecordModel.findByIdAndDelete(id);
    if (!record) {
      throw new NotFoundException('Medical record not found');
    }
  }

  async count(): Promise<number> {
    return this.medicalRecordModel.countDocuments();
  }

  async countByPatient(patientId: string): Promise<number> {
    if (!Types.ObjectId.isValid(patientId)) {
      throw new BadRequestException('Invalid patient ID');
    }

    return this.medicalRecordModel.countDocuments({
      patientId: new Types.ObjectId(patientId),
    });
  }

  async getStatistics(): Promise<{
    total: number;
    byStatus: Array<{ _id: string; count: number }>;
    byVisitType: Array<{ _id: string; count: number }>;
    recentRecords: number;
    sensitiveRecords: number;
  }> {
    const total = await this.medicalRecordModel.countDocuments();

    const byStatus = await this.medicalRecordModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const byVisitType = await this.medicalRecordModel.aggregate([
      { $group: { _id: '$visitType', count: { $sum: 1 } } },
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRecords = await this.medicalRecordModel.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    const sensitiveRecords = await this.medicalRecordModel.countDocuments({
      isSensitive: true,
    });

    return {
      total,
      byStatus,
      byVisitType,
      recentRecords,
      sensitiveRecords,
    };
  }

  async finalizeRecord(id: string): Promise<MedicalRecord> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid medical record ID');
    }

    const record = await this.medicalRecordModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status: 'finalized' as const,
        },
      },
      { new: true, runValidators: true },
    );

    if (!record) {
      throw new NotFoundException('Medical record not found');
    }

    return record;
  }
}
