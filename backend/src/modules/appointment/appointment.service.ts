import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Appointment,
  AppointmentStatus,
} from './schemas/appointment.schema';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
  ) {}

  private generateAppointmentCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `APT-${timestamp}${random}`;
  }

  /**
   * Check for scheduling conflicts
   * Returns true if there's a conflict
   */
  async hasConflict(
    doctorId: string,
    scheduledDate: Date,
    duration: number,
    excludeAppointmentId?: string,
  ): Promise<boolean> {
    const appointmentStart = new Date(scheduledDate);
    const appointmentEnd = new Date(appointmentStart.getTime() + duration * 60000);

    const conflictingAppointment = await this.appointmentModel.findOne({
      doctorId: new Types.ObjectId(doctorId),
      status: {
        $nin: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW],
      },
      _id: excludeAppointmentId
        ? { $ne: new Types.ObjectId(excludeAppointmentId) }
        : undefined,
      $or: [
        {
          scheduledDate: { $lt: appointmentEnd },
          $expr: {
            $gt: [
              { $add: ['$scheduledDate', { $multiply: ['$duration', 60000] }] },
              appointmentStart,
            ],
          },
        },
        {
          scheduledDate: { $gte: appointmentStart, $lt: appointmentEnd },
        },
      ],
    });

    return !!conflictingAppointment;
  }

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    // Check for scheduling conflicts
    const hasConflict = await this.hasConflict(
      createAppointmentDto.doctorId,
      createAppointmentDto.scheduledDate,
      createAppointmentDto.duration,
    );

    if (hasConflict) {
      throw new ConflictException(
        'Doctor already has an appointment scheduled at this time',
      );
    }

    const appointmentCode = this.generateAppointmentCode();

    const createdAppointment = new this.appointmentModel({
      ...createAppointmentDto,
      appointmentCode,
      patientId: new Types.ObjectId(createAppointmentDto.patientId),
      doctorId: new Types.ObjectId(createAppointmentDto.doctorId),
      receptionistId: createAppointmentDto.receptionistId
        ? new Types.ObjectId(createAppointmentDto.receptionistId)
        : undefined,
    });

    return createdAppointment.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    doctorId?: string,
    patientId?: string,
    status?: AppointmentStatus,
    appointmentType?: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    appointments: Appointment[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const query: any = {};

    if (doctorId) {
      query.doctorId = new Types.ObjectId(doctorId);
    }

    if (patientId) {
      query.patientId = new Types.ObjectId(patientId);
    }

    if (status) {
      query.status = status;
    }

    if (appointmentType) {
      query.appointmentType = appointmentType;
    }

    if (startDate || endDate) {
      query.scheduledDate = {};
      if (startDate) {
        query.scheduledDate.$gte = startDate;
      }
      if (endDate) {
        query.scheduledDate.$lte = endDate;
      }
    }

    const skip = (page - 1) * limit;
    const [appointments, total] = await Promise.all([
      this.appointmentModel
        .find(query)
        .populate('patientId', 'firstName lastName patientCode')
        .populate('doctorId', 'doctorCode specialization')
        .skip(skip)
        .limit(limit)
        .sort({ scheduledDate: -1 }),
      this.appointmentModel.countDocuments(query),
    ]);

    return {
      appointments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Appointment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid appointment ID');
    }

    const appointment = await this.appointmentModel
      .findById(id)
      .populate('patientId', 'firstName lastName patientCode phone email')
      .populate('doctorId', 'doctorCode specialization consultationFee')
      .populate('receptionistId', 'fullName role');

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async findByDoctorId(
    doctorId: string,
    page = 1,
    limit = 10,
    status?: AppointmentStatus,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    appointments: Appointment[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return this.findAll(page, limit, doctorId, undefined, status, undefined, startDate, endDate);
  }

  async findByPatientId(
    patientId: string,
    page = 1,
    limit = 10,
    status?: AppointmentStatus,
  ): Promise<{
    appointments: Appointment[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return this.findAll(page, limit, undefined, patientId, status);
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid appointment ID');
    }

    // If rescheduling, check for conflicts
    if (updateAppointmentDto.scheduledDate || updateAppointmentDto.duration) {
      const appointment = await this.findOne(id);
      const newScheduledDate = updateAppointmentDto.scheduledDate || (appointment as any).scheduledDate;
      const newDuration = updateAppointmentDto.duration || (appointment as any).duration;
      const doctorId = updateAppointmentDto.doctorId || (appointment as any).doctorId._id;

      const hasConflict = await this.hasConflict(
        doctorId.toString(),
        newScheduledDate,
        newDuration,
        id,
      );

      if (hasConflict) {
        throw new ConflictException(
          'Doctor already has an appointment scheduled at this time',
        );
      }
    }

    // Handle status transitions
    if (updateAppointmentDto.status) {
      const appointment = await this.findOne(id);
      this.validateStatusTransition(
        (appointment as any).status,
        updateAppointmentDto.status,
      );

      // Set timestamps for status changes
      if (updateAppointmentDto.status === AppointmentStatus.CONFIRMED) {
        updateAppointmentDto.confirmedAt = new Date();
      } else if (updateAppointmentDto.status === AppointmentStatus.COMPLETED) {
        updateAppointmentDto.completedAt = new Date();
      } else if (updateAppointmentDto.status === AppointmentStatus.CANCELLED) {
        updateAppointmentDto.cancelledAt = new Date();
      }
    }

    const updatedAppointment = await this.appointmentModel.findByIdAndUpdate(
      id,
      { $set: updateAppointmentDto },
      { new: true, runValidators: true },
    );

    if (!updatedAppointment) {
      throw new NotFoundException('Appointment not found');
    }

    return updatedAppointment;
  }

  /**
   * Validate appointment status transitions
   */
  private validateStatusTransition(
    currentStatus: AppointmentStatus,
    newStatus: AppointmentStatus,
  ): void {
    const validTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
      [AppointmentStatus.PENDING]: [
        AppointmentStatus.CONFIRMED,
        AppointmentStatus.CANCELLED,
      ],
      [AppointmentStatus.CONFIRMED]: [
        AppointmentStatus.IN_PROGRESS,
        AppointmentStatus.CANCELLED,
        AppointmentStatus.NO_SHOW,
      ],
      [AppointmentStatus.IN_PROGRESS]: [
        AppointmentStatus.COMPLETED,
        AppointmentStatus.CANCELLED,
      ],
      [AppointmentStatus.COMPLETED]: [],
      [AppointmentStatus.CANCELLED]: [],
      [AppointmentStatus.NO_SHOW]: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid appointment ID');
    }

    const appointment = await this.appointmentModel.findByIdAndDelete(id);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
  }

  async count(): Promise<number> {
    return this.appointmentModel.countDocuments();
  }

  async getStatistics(): Promise<{
    total: number;
    byStatus: Record<AppointmentStatus, number>;
    byType: Array<{ _id: string; count: number }>;
    todayAppointments: number;
    upcomingAppointments: number;
  }> {
    const total = await this.appointmentModel.countDocuments();

    const byStatusAgg = await this.appointmentModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const byStatus = {} as Record<AppointmentStatus, number>;
    Object.values(AppointmentStatus).forEach((status) => {
      byStatus[status] = 0;
    });
    byStatusAgg.forEach((item) => {
      byStatus[item._id] = item.count;
    });

    const byType = await this.appointmentModel.aggregate([
      { $group: { _id: '$appointmentType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await this.appointmentModel.countDocuments({
      scheduledDate: { $gte: today, $lt: tomorrow },
      status: {
        $nin: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW],
      },
    });

    const upcomingAppointments = await this.appointmentModel.countDocuments({
      scheduledDate: { $gte: tomorrow },
      status: {
        $nin: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW],
      },
    });

    return {
      total,
      byStatus,
      byType,
      todayAppointments,
      upcomingAppointments,
    };
  }

  /**
   * Get appointments for a specific date range
   */
  async getAppointmentsByDateRange(
    startDate: Date,
    endDate: Date,
    doctorId?: string,
  ): Promise<Appointment[]> {
    const query: any = {
      scheduledDate: { $gte: startDate, $lte: endDate },
    };

    if (doctorId) {
      query.doctorId = new Types.ObjectId(doctorId);
    }

    return this.appointmentModel
      .find(query)
      .populate('patientId', 'firstName lastName patientCode phone')
      .populate('doctorId', 'doctorCode specialization')
      .sort({ scheduledDate: 1 });
  }

  /**
   * Get available time slots for a doctor on a specific date
   */
  async getAvailableSlots(
    doctorId: string,
    date: Date,
    defaultDuration = 30,
  ): Promise<{ available: boolean; slots: Date[] }> {
    const startOfDay = new Date(date);
    startOfDay.setHours(8, 0, 0, 0); // 8 AM

    const endOfDay = new Date(date);
    endOfDay.setHours(17, 0, 0, 0); // 5 PM

    const appointments = await this.appointmentModel.find({
      doctorId: new Types.ObjectId(doctorId),
      scheduledDate: { $gte: startOfDay, $lte: endOfDay },
      status: {
        $nin: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW],
      },
    });

    const slots: Date[] = [];
    const slotInterval = 30; // 30 minutes
    let currentSlot = new Date(startOfDay);

    while (currentSlot < endOfDay) {
      const slotEnd = new Date(currentSlot.getTime() + defaultDuration * 60000);

      const hasConflict = appointments.some((apt) => {
        const aptStart = apt.scheduledDate;
        const aptEnd = new Date(aptStart.getTime() + apt.duration * 60000);
        return currentSlot < aptEnd && slotEnd > aptStart;
      });

      if (!hasConflict) {
        slots.push(new Date(currentSlot));
      }

      currentSlot = new Date(currentSlot.getTime() + slotInterval * 60000);
    }

    return {
      available: slots.length > 0,
      slots,
    };
  }
}
