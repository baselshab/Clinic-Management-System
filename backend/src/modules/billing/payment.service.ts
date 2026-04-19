import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment } from './schemas/payment.schema';
import { CreatePaymentDto, UpdatePaymentDto } from './dto';
import { InvoiceService } from './invoice.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: Model<Payment>,
    private invoiceService: InvoiceService,
  ) {}

  private generatePaymentReference(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `PAY-${timestamp}${random}`;
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const paymentReference = this.generatePaymentReference();

    const createdPayment = new this.paymentModel({
      ...createPaymentDto,
      paymentReference,
      invoiceId: new Types.ObjectId(createPaymentDto.invoiceId),
      patientId: new Types.ObjectId(createPaymentDto.patientId),
      doctorId: createPaymentDto.doctorId
        ? new Types.ObjectId(createPaymentDto.doctorId)
        : undefined,
    });

    const savedPayment = await createdPayment.save();

    // Update invoice paid amount if payment is completed
    if (savedPayment.status === 'completed') {
      await this.invoiceService.updatePaidAmount(
        createPaymentDto.invoiceId,
        createPaymentDto.amount,
      );
    }

    return savedPayment;
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    patientId?: string,
    doctorId?: string,
    invoiceId?: string,
    status?: string,
    paymentMethod?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<{
    payments: Payment[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const query: any = {};

    if (search) {
      query.$or = [
        { paymentReference: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { transactionId: { $regex: search, $options: 'i' } },
        { referenceNumber: { $regex: search, $options: 'i' } },
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

    if (invoiceId) {
      if (!Types.ObjectId.isValid(invoiceId)) {
        throw new BadRequestException('Invalid invoice ID');
      }
      query.invoiceId = new Types.ObjectId(invoiceId);
    }

    if (status) {
      query.status = status;
    }

    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) {
        query.paymentDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.paymentDate.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      this.paymentModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ paymentDate: -1 })
        .populate('invoiceId', 'invoiceNumber totalAmount')
        .populate('patientId', 'firstName lastName patientCode')
        .populate('doctorId', 'doctorCode specialization'),
      this.paymentModel.countDocuments(query),
    ]);

    return {
      payments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid payment ID');
    }

    const payment = await this.paymentModel
      .findById(id)
      .populate('invoiceId', 'invoiceNumber totalAmount status')
      .populate('patientId', 'firstName lastName patientCode email phone')
      .populate('doctorId', 'doctorCode specialization name');

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async findByInvoiceId(invoiceId: string): Promise<Payment[]> {
    if (!Types.ObjectId.isValid(invoiceId)) {
      throw new BadRequestException('Invalid invoice ID');
    }

    return this.paymentModel
      .find({ invoiceId: new Types.ObjectId(invoiceId) })
      .sort({ paymentDate: -1 });
  }

  async findByPatientId(patientId: string): Promise<Payment[]> {
    if (!Types.ObjectId.isValid(patientId)) {
      throw new BadRequestException('Invalid patient ID');
    }

    return this.paymentModel
      .find({ patientId: new Types.ObjectId(patientId) })
      .sort({ paymentDate: -1 })
      .populate('invoiceId', 'invoiceNumber totalAmount');
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid payment ID');
    }

    const updateData: any = { ...updatePaymentDto };

    if (updateData.invoiceId) {
      updateData.invoiceId = new Types.ObjectId(updateData.invoiceId);
    }
    if (updateData.patientId) {
      updateData.patientId = new Types.ObjectId(updateData.patientId);
    }
    if (updateData.doctorId) {
      updateData.doctorId = new Types.ObjectId(updateData.doctorId);
    }

    const payment = await this.paymentModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid payment ID');
    }

    const payment = await this.paymentModel.findByIdAndDelete(id);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
  }

  async count(): Promise<number> {
    return this.paymentModel.countDocuments();
  }

  async markAsCompleted(id: string): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid payment ID');
    }

    const payment = await this.paymentModel.findById(id);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const updatedPayment = await this.paymentModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status: 'completed' as any,
        },
      },
      { new: true, runValidators: true },
    );

    if (!updatedPayment) {
      throw new NotFoundException('Payment not found');
    }

    // Update invoice paid amount
    await this.invoiceService.updatePaidAmount(
      (payment.invoiceId as any)._id.toString(),
      payment.amount,
    );

    return updatedPayment;
  }

  async markAsFailed(id: string, reason: string): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid payment ID');
    }

    const payment = await this.paymentModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status: 'failed' as any,
          failureReason: reason,
        },
      },
      { new: true, runValidators: true },
    );

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async refundPayment(id: string, reason: string): Promise<Payment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid payment ID');
    }

    const payment = await this.paymentModel.findById(id);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== 'completed') {
      throw new BadRequestException('Only completed payments can be refunded');
    }

    const updatedPayment = await this.paymentModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status: 'refunded' as any,
          refundReason: reason,
          refundedAmount: payment.amount,
          refundedAt: new Date(),
        },
      },
      { new: true, runValidators: true },
    );

    if (!updatedPayment) {
      throw new NotFoundException('Payment not found');
    }

    return updatedPayment;
  }

  async getStatistics(): Promise<{
    total: number;
    totalCollected: number;
    totalRefunded: number;
    netRevenue: number;
    byStatus: Array<{ _id: string; count: number }>;
    byMethod: Array<{ _id: string; count: number; totalAmount: number }>;
    recentPayments: number;
  }> {
    const total = await this.paymentModel.countDocuments();

    const totalCollectedResult = await this.paymentModel.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalCollected =
      totalCollectedResult.length > 0 ? totalCollectedResult[0].total : 0;

    const totalRefundedResult = await this.paymentModel.aggregate([
      { $match: { status: 'refunded' } },
      { $group: { _id: null, total: { $sum: '$refundedAmount' } } },
    ]);
    const totalRefunded =
      totalRefundedResult.length > 0 ? totalRefundedResult[0].total : 0;

    const netRevenue = totalCollected - totalRefunded;

    const byStatus = await this.paymentModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const byMethod = await this.paymentModel.aggregate([
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPayments = await this.paymentModel.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      status: 'completed',
    });

    return {
      total,
      totalCollected,
      totalRefunded,
      netRevenue,
      byStatus,
      byMethod,
      recentPayments,
    };
  }
}
