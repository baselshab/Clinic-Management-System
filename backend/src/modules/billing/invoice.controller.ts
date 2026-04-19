import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { InvoiceService } from './invoice.service';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  InvoiceResponseDto,
} from './dto';
import { Invoice } from './schemas/invoice.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators';
import { UserRole } from '../user/schemas/user.schema';

@ApiTags('invoices')
@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiResponse({
    status: 201,
    description: 'Invoice created successfully',
    type: InvoiceResponseDto,
  })
  async create(
    @Body() createInvoiceDto: CreateInvoiceDto,
  ): Promise<Invoice> {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Get all invoices with pagination and filters' })
  @ApiResponse({ status: 200, description: 'List of invoices' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by invoice number or description',
  })
  @ApiQuery({
    name: 'patientId',
    required: false,
    description: 'Filter by patient ID',
  })
  @ApiQuery({
    name: 'doctorId',
    required: false,
    description: 'Filter by doctor ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: [
      'draft',
      'pending',
      'sent',
      'partially_paid',
      'paid',
      'overdue',
      'cancelled',
      'refunded',
    ],
  })
  @ApiQuery({
    name: 'invoiceType',
    required: false,
    enum: [
      'consultation',
      'procedure',
      'lab_test',
      'medication',
      'follow_up',
      'emergency',
      'annual_checkup',
      'other',
    ],
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter by issue date start range',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter by issue date end range',
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('patientId') patientId?: string,
    @Query('doctorId') doctorId?: string,
    @Query('status') status?: string,
    @Query('invoiceType') invoiceType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.invoiceService.findAll(
      page || 1,
      limit || 10,
      search,
      patientId,
      doctorId,
      status,
      invoiceType,
      startDate,
      endDate,
    );
  }

  @Get('statistics')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get invoice statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getStatistics() {
    return this.invoiceService.getStatistics();
  }

  @Get('overdue/mark')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Mark overdue invoices' })
  @ApiResponse({ status: 200, description: 'Overdue invoices marked successfully' })
  async markOverdueInvoices() {
    const count = await this.invoiceService.markOverdueInvoices();
    return { message: `${count} invoice(s) marked as overdue`, count };
  }

  @Get('patient/:patientId')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get all invoices for a patient' })
  @ApiResponse({ status: 200, description: 'List of invoices' })
  async findByPatientId(@Param('patientId') patientId: string) {
    return this.invoiceService.findByPatientId(patientId);
  }

  @Get('doctor/:doctorId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all invoices by a doctor' })
  @ApiResponse({ status: 200, description: 'List of invoices' })
  async findByDoctorId(@Param('doctorId') doctorId: string) {
    return this.invoiceService.findByDoctorId(doctorId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiResponse({ status: 200, description: 'Invoice found', type: InvoiceResponseDto })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async findOne(@Param('id') id: string): Promise<Invoice> {
    return this.invoiceService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Update invoice' })
  @ApiResponse({
    status: 200,
    description: 'Invoice updated successfully',
    type: InvoiceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    return this.invoiceService.update(id, updateInvoiceDto);
  }

  @Post(':id/send')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Mark invoice as sent' })
  @ApiResponse({
    status: 200,
    description: 'Invoice marked as sent',
    type: InvoiceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async markAsSent(@Param('id') id: string): Promise<Invoice> {
    return this.invoiceService.markAsSent(id);
  }

  @Post(':id/cancel')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cancel an invoice' })
  @ApiResponse({
    status: 200,
    description: 'Invoice cancelled',
    type: InvoiceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async cancelInvoice(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ): Promise<Invoice> {
    return this.invoiceService.cancelInvoice(id, reason);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete invoice' })
  @ApiResponse({ status: 200, description: 'Invoice deleted successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.invoiceService.remove(id);
  }
}
