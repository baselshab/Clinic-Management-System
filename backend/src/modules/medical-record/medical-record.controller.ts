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
import { MedicalRecordService } from './medical-record.service';
import {
  CreateMedicalRecordDto,
  UpdateMedicalRecordDto,
  MedicalRecordResponseDto,
} from './dto';
import { MedicalRecord } from './schemas/medical-record.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators';
import { UserRole } from '../user/schemas/user.schema';

@ApiTags('medical-records')
@Controller('medical-records')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class MedicalRecordController {
  constructor(
    private readonly medicalRecordService: MedicalRecordService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Create a new medical record' })
  @ApiResponse({
    status: 201,
    description: 'Medical record created successfully',
    type: MedicalRecordResponseDto,
  })
  async create(
    @Body() createMedicalRecordDto: CreateMedicalRecordDto,
  ): Promise<MedicalRecord> {
    return this.medicalRecordService.create(createMedicalRecordDto);
  }

  @Get()
  @Roles(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE,
    UserRole.RECEPTIONIST,
  )
  @ApiOperation({
    summary: 'Get all medical records with pagination and filters',
  })
  @ApiResponse({ status: 200, description: 'List of medical records' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by record code, diagnosis, or complaint',
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
    enum: ['draft', 'finalized', 'amended', 'archived'],
  })
  @ApiQuery({
    name: 'visitType',
    required: false,
    enum: [
      'consultation',
      'emergency',
      'follow_up',
      'procedure',
      'lab_test',
      'imaging',
      'vaccination',
      'check_up',
    ],
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter by visit date start range',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter by visit date end range',
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('patientId') patientId?: string,
    @Query('doctorId') doctorId?: string,
    @Query('status') status?: string,
    @Query('visitType') visitType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.medicalRecordService.findAll(
      page || 1,
      limit || 10,
      search,
      patientId,
      doctorId,
      status,
      visitType,
      startDate,
      endDate,
    );
  }

  @Get('statistics')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get medical record statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getStatistics() {
    return this.medicalRecordService.getStatistics();
  }

  @Get('patient/:patientId')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'Get all medical records for a patient' })
  @ApiResponse({ status: 200, description: 'List of medical records' })
  async findByPatientId(@Param('patientId') patientId: string) {
    return this.medicalRecordService.findByPatientId(patientId);
  }

  @Get('doctor/:doctorId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all medical records by a doctor' })
  @ApiResponse({ status: 200, description: 'List of medical records' })
  async findByDoctorId(@Param('doctorId') doctorId: string) {
    return this.medicalRecordService.findByDoctorId(doctorId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'Get medical record by ID' })
  @ApiResponse({ status: 200, description: 'Medical record found', type: MedicalRecordResponseDto })
  @ApiResponse({ status: 404, description: 'Medical record not found' })
  async findOne(@Param('id') id: string): Promise<MedicalRecord> {
    return this.medicalRecordService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Update medical record' })
  @ApiResponse({
    status: 200,
    description: 'Medical record updated successfully',
    type: MedicalRecordResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Medical record not found' })
  async update(
    @Param('id') id: string,
    @Body() updateMedicalRecordDto: UpdateMedicalRecordDto,
  ): Promise<MedicalRecord> {
    return this.medicalRecordService.update(id, updateMedicalRecordDto);
  }

  @Post(':id/finalize')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Finalize a medical record' })
  @ApiResponse({
    status: 200,
    description: 'Medical record finalized',
    type: MedicalRecordResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Medical record not found' })
  async finalizeRecord(@Param('id') id: string): Promise<MedicalRecord> {
    return this.medicalRecordService.finalizeRecord(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete medical record' })
  @ApiResponse({ status: 200, description: 'Medical record deleted successfully' })
  @ApiResponse({ status: 404, description: 'Medical record not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.medicalRecordService.remove(id);
  }
}
