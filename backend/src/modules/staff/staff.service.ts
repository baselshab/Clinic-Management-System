import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Staff, StaffRole, StaffStatus } from './schemas/staff.schema';
import { CreateStaffDto, UpdateStaffDto } from './dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff.name) private staffModel: Model<Staff>,
  ) {}

  private generateStaffCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `STF-${timestamp}${random}`;
  }

  async create(createStaffDto: CreateStaffDto): Promise<Staff> {
    // Check if user already has a staff record
    const existingStaff = await this.staffModel.findOne({
      userId: createStaffDto.userId,
    });
    if (existingStaff) {
      throw new ConflictException('User already has a staff record');
    }

    const staffCode = this.generateStaffCode();
    
    const createdStaff = new this.staffModel({
      ...createStaffDto,
      staffCode,
      userId: new Types.ObjectId(createStaffDto.userId),
      assignedDoctor: createStaffDto.assignedDoctor 
        ? new Types.ObjectId(createStaffDto.assignedDoctor) 
        : undefined,
    });

    return createdStaff.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    role?: StaffRole,
    status?: StaffStatus,
    department?: string,
  ): Promise<{ staff: Staff[]; total: number; page: number; totalPages: number }> {
    const query: any = {};

    if (search) {
      query.$or = [
        { staffCode: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) {
      query.role = role;
    }

    if (status) {
      query.status = status;
    }

    if (department) {
      query.department = { $regex: department, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const [staff, total] = await Promise.all([
      this.staffModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.staffModel.countDocuments(query),
    ]);

    return {
      staff,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Staff> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid staff ID');
    }

    const staff = await this.staffModel.findById(id);
    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    return staff;
  }

  async findByUserId(userId: string): Promise<Staff | null> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    return this.staffModel.findOne({ userId: new Types.ObjectId(userId) });
  }

  async findByRole(
    role: StaffRole,
    page = 1,
    limit = 10,
  ): Promise<{ staff: Staff[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const [staff, total] = await Promise.all([
      this.staffModel
        .find({ role, status: StaffStatus.ACTIVE })
        .skip(skip)
        .limit(limit)
        .sort({ fullName: 1 }),
      this.staffModel.countDocuments({ role, status: StaffStatus.ACTIVE }),
    ]);

    return {
      staff,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, updateStaffDto: UpdateStaffDto): Promise<Staff> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid staff ID');
    }

    // Convert assignedDoctor to ObjectId if provided
    if (updateStaffDto.assignedDoctor) {
      (updateStaffDto as any).assignedDoctor = new Types.ObjectId(updateStaffDto.assignedDoctor);
    }

    const staff = await this.staffModel.findByIdAndUpdate(
      id,
      { $set: updateStaffDto },
      { new: true, runValidators: true },
    );

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    return staff;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid staff ID');
    }

    const staff = await this.staffModel.findByIdAndDelete(id);
    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }
  }

  async count(): Promise<number> {
    return this.staffModel.countDocuments();
  }

  async getStatistics(): Promise<{
    total: number;
    active: number;
    onLeave: number;
    byRole: Array<{ _id: string; count: number }>;
    byDepartment: Array<{ _id: string; count: number }>;
    byShift: Array<{ _id: string; count: number }>;
  }> {
    const total = await this.staffModel.countDocuments();
    const active = await this.staffModel.countDocuments({ status: StaffStatus.ACTIVE });
    const onLeave = await this.staffModel.countDocuments({ status: StaffStatus.ON_LEAVE });

    const byRole = await this.staffModel.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const byDepartment = await this.staffModel.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const byShift = await this.staffModel.aggregate([
      { $group: { _id: '$shift', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return { total, active, onLeave, byRole, byDepartment, byShift };
  }
}
