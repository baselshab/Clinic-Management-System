import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice } from './schemas/invoice.schema';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name)
    private invoiceModel: Model<Invoice>,
  ) {}

  private generateInvoiceNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `INV-${timestamp}${random}`;
  }

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const invoiceNumber = this.generateInvoiceNumber();

    const createdInvoice = new this.invoiceModel({
      ...createInvoiceDto,
      invoiceNumber,
      patientId: new Types.ObjectId(createInvoiceDto.patientId),
      doctorId: createInvoiceDto.doctorId
        ? new Types.ObjectId(createInvoiceDto.doctorId)
        : undefined,
      appointmentId: createInvoiceDto.appointmentId
        ? new Types.ObjectId(createInvoiceDto.appointmentId)
        : undefined,
      medicalRecordId: createInvoiceDto.medicalRecordId
        ? new Types.ObjectId(createInvoiceDto.medicalRecordId)
        : undefined,
    });

    return createdInvoice.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    patientId?: string,
    doctorId?: string,
    status?: string,
    invoiceType?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<{
    invoices: Invoice[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const query: any = {};

    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'items.description': { $regex: search, $options: 'i' } },
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

    if (invoiceType) {
      query.invoiceType = invoiceType;
    }

    if (startDate || endDate) {
      query.issueDate = {};
      if (startDate) {
        query.issueDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.issueDate.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;
    const [invoices, total] = await Promise.all([
      this.invoiceModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ issueDate: -1 })
        .populate('patientId', 'firstName lastName patientCode')
        .populate('doctorId', 'doctorCode specialization'),
      this.invoiceModel.countDocuments(query),
    ]);

    return {
      invoices,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Invoice> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid invoice ID');
    }

    const invoice = await this.invoiceModel
      .findById(id)
      .populate('patientId', 'firstName lastName patientCode email phone')
      .populate('doctorId', 'doctorCode specialization name')
      .populate('appointmentId', 'appointmentCode scheduledDate');

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async findByPatientId(patientId: string): Promise<Invoice[]> {
    if (!Types.ObjectId.isValid(patientId)) {
      throw new BadRequestException('Invalid patient ID');
    }

    return this.invoiceModel
      .find({ patientId: new Types.ObjectId(patientId) })
      .sort({ issueDate: -1 })
      .populate('doctorId', 'doctorCode specialization');
  }

  async findByDoctorId(doctorId: string): Promise<Invoice[]> {
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new BadRequestException('Invalid doctor ID');
    }

    return this.invoiceModel
      .find({ doctorId: new Types.ObjectId(doctorId) })
      .sort({ issueDate: -1 })
      .populate('patientId', 'firstName lastName patientCode');
  }

  async findByAppointmentId(appointmentId: string): Promise<Invoice | null> {
    if (!Types.ObjectId.isValid(appointmentId)) {
      throw new BadRequestException('Invalid appointment ID');
    }

    return this.invoiceModel.findOne({
      appointmentId: new Types.ObjectId(appointmentId),
    });
  }

  async update(
    id: string,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid invoice ID');
    }

    const updateData: any = { ...updateInvoiceDto };

    if (updateData.patientId) {
      updateData.patientId = new Types.ObjectId(updateData.patientId);
    }
    if (updateData.doctorId) {
      updateData.doctorId = new Types.ObjectId(updateData.doctorId);
    }
    if (updateData.appointmentId) {
      updateData.appointmentId = new Types.ObjectId(updateData.appointmentId);
    }
    if (updateData.medicalRecordId) {
      updateData.medicalRecordId = new Types.ObjectId(
        updateData.medicalRecordId,
      );
    }

    const invoice = await this.invoiceModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid invoice ID');
    }

    const invoice = await this.invoiceModel.findByIdAndDelete(id);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
  }

  async count(): Promise<number> {
    return this.invoiceModel.countDocuments();
  }

  async updatePaidAmount(
    invoiceId: string,
    paymentAmount: number,
  ): Promise<Invoice> {
    if (!Types.ObjectId.isValid(invoiceId)) {
      throw new BadRequestException('Invalid invoice ID');
    }

    const invoice = await this.invoiceModel.findById(invoiceId);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    const newPaidAmount = invoice.paidAmount + paymentAmount;
    const balanceAmount = invoice.totalAmount - newPaidAmount;

    let newStatus = invoice.status;
    if (newPaidAmount >= invoice.totalAmount) {
      newStatus = 'paid' as any;
    } else if (newPaidAmount > 0) {
      newStatus = 'partially_paid' as any;
    }

    const updatedInvoice = await this.invoiceModel.findByIdAndUpdate(
      invoiceId,
      {
        $set: {
          paidAmount: newPaidAmount,
          balanceAmount: Math.max(0, balanceAmount),
          status: newStatus,
          ...(newStatus === 'paid' ? { paidAt: new Date() } : {}),
        },
      },
      { new: true, runValidators: true },
    );

    if (!updatedInvoice) {
      throw new NotFoundException('Invoice not found');
    }

    return updatedInvoice;
  }

  async markAsSent(id: string): Promise<Invoice> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid invoice ID');
    }

    const invoice = await this.invoiceModel.findByIdAndUpdate(
      id,
      { $set: { status: 'sent' as any } },
      { new: true, runValidators: true },
    );

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async cancelInvoice(id: string, reason: string): Promise<Invoice> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid invoice ID');
    }

    const invoice = await this.invoiceModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status: 'cancelled' as any,
          cancelledAt: new Date(),
          cancellationReason: reason,
        },
      },
      { new: true, runValidators: true },
    );

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async getStatistics(): Promise<{
    total: number;
    totalRevenue: number;
    totalPaid: number;
    totalPending: number;
    totalOverdue: number;
    byStatus: Array<{ _id: string; count: number }>;
    byType: Array<{ _id: string; count: number }>;
    recentInvoices: number;
  }> {
    const total = await this.invoiceModel.countDocuments();

    const totalRevenueResult = await this.invoiceModel.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue =
      totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

    const totalPaidResult = await this.invoiceModel.aggregate([
      { $group: { _id: null, total: { $sum: '$paidAmount' } } },
    ]);
    const totalPaid =
      totalPaidResult.length > 0 ? totalPaidResult[0].total : 0;

    const totalPending = await this.invoiceModel.countDocuments({
      status: { $in: ['pending', 'sent'] },
    });

    const totalOverdue = await this.invoiceModel.countDocuments({
      status: 'overdue',
    });

    const byStatus = await this.invoiceModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const byType = await this.invoiceModel.aggregate([
      { $group: { _id: '$invoiceType', count: { $sum: 1 } } },
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentInvoices = await this.invoiceModel.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    return {
      total,
      totalRevenue,
      totalPaid,
      totalPending,
      totalOverdue,
      byStatus,
      byType,
      recentInvoices,
    };
  }

  async markOverdueInvoices(): Promise<number> {
    const now = new Date();
    const result = await this.invoiceModel.updateMany(
      {
        status: { $in: ['pending', 'sent'] },
        dueDate: { $lt: now },
      },
      { $set: { status: 'overdue' as any } },
    );

    return result.modifiedCount;
  }
}
