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
import { AppointmentService } from './appointment.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
  AppointmentResponseDto,
} from './dto';
import { Appointment, AppointmentStatus } from './schemas/appointment.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators';
import { UserRole } from '../user/schemas/user.schema';

@ApiTags('appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({
    status: 201,
    description: 'Appointment created successfully',
    type: AppointmentResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Scheduling conflict detected' })
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get all appointments with filters' })
  @ApiResponse({ status: 200, description: 'List of appointments' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'doctorId', required: false, description: 'Filter by doctor' })
  @ApiQuery({ name: 'patientId', required: false, description: 'Filter by patient' })
  @ApiQuery({ name: 'status', required: false, enum: AppointmentStatus })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date range' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date range' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('doctorId') doctorId?: string,
    @Query('patientId') patientId?: string,
    @Query('status') status?: AppointmentStatus,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.appointmentService.findAll(
      page || 1,
      limit || 10,
      doctorId,
      patientId,
      status,
      undefined,
      startDate,
      endDate,
    );
  }

  @Get('statistics')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get appointment statistics' })
  @ApiResponse({ status: 200, description: 'Appointment statistics' })
  async getStatistics() {
    return this.appointmentService.getStatistics();
  }

  @Get('available-slots')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get available time slots for a doctor' })
  @ApiResponse({ status: 200, description: 'Available time slots' })
  @ApiQuery({ name: 'doctorId', required: true, description: 'Doctor ID' })
  @ApiQuery({ name: 'date', required: true, description: 'Date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'duration', required: false, example: 30, description: 'Duration in minutes' })
  async getAvailableSlots(
    @Query('doctorId') doctorId: string,
    @Query('date') date: string,
    @Query('duration') duration?: number,
  ) {
    const appointmentDate = new Date(date);
    return this.appointmentService.getAvailableSlots(
      doctorId,
      appointmentDate,
      duration || 30,
    );
  }

  @Get('doctor/:doctorId')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get appointments by doctor' })
  @ApiResponse({ status: 200, description: 'List of doctor appointments' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'status', required: false, enum: AppointmentStatus })
  async findByDoctorId(
    @Param('doctorId') doctorId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: AppointmentStatus,
  ) {
    return this.appointmentService.findByDoctorId(
      doctorId,
      page || 1,
      limit || 10,
      status,
    );
  }

  @Get('patient/:patientId')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.PATIENT)
  @ApiOperation({ summary: 'Get appointments by patient' })
  @ApiResponse({ status: 200, description: 'List of patient appointments' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'status', required: false, enum: AppointmentStatus })
  async findByPatientId(
    @Param('patientId') patientId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: AppointmentStatus,
  ) {
    return this.appointmentService.findByPatientId(
      patientId,
      page || 1,
      limit || 10,
      status,
    );
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST, UserRole.PATIENT)
  @ApiOperation({ summary: 'Get appointment by ID' })
  @ApiResponse({ status: 200, description: 'Appointment found', type: AppointmentResponseDto })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async findOne(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Update appointment' })
  @ApiResponse({
    status: 200,
    description: 'Appointment updated successfully',
    type: AppointmentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  @ApiResponse({ status: 409, description: 'Scheduling conflict detected' })
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  @Patch(':id/confirm')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Confirm appointment' })
  @ApiResponse({ status: 200, description: 'Appointment confirmed' })
  async confirmAppointment(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentService.update(id, {
      status: AppointmentStatus.CONFIRMED,
    });
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.PATIENT)
  @ApiOperation({ summary: 'Cancel appointment' })
  @ApiResponse({ status: 200, description: 'Appointment cancelled' })
  async cancelAppointment(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ): Promise<Appointment> {
    return this.appointmentService.update(id, {
      status: AppointmentStatus.CANCELLED,
      cancellationReason: reason,
    });
  }

  @Patch(':id/complete')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Mark appointment as completed' })
  @ApiResponse({ status: 200, description: 'Appointment completed' })
  async completeAppointment(
    @Param('id') id: string,
    @Body() updateData: {
      diagnosis?: string;
      treatmentPlan?: string[];
      notes?: string;
      doctorNotes?: string;
      isFollowUpNeeded?: boolean;
      followUpDate?: Date;
    },
  ): Promise<Appointment> {
    return this.appointmentService.update(id, {
      status: AppointmentStatus.COMPLETED,
      ...updateData,
    });
  }

  @Patch(':id/no-show')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Mark appointment as no-show' })
  @ApiResponse({ status: 200, description: 'Appointment marked as no-show' })
  async markNoShow(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ): Promise<Appointment> {
    return this.appointmentService.update(id, {
      status: AppointmentStatus.NO_SHOW,
      noShowReason: reason,
    });
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete appointment' })
  @ApiResponse({ status: 200, description: 'Appointment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.appointmentService.remove(id);
  }
}
