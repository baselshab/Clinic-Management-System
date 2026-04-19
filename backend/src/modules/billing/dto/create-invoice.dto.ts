import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDate,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsArray,
  IsMongoId,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InvoiceStatus, InvoiceType, PaymentMethod } from '../schemas/invoice.schema';

export class InvoiceItemDto {
  @ApiProperty({ example: 'Consultation fee' })
  @IsString()
  description: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @Min(0)
  amount: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsMongoId()
  patientId: string;

  @ApiPropertyOptional({ description: 'Doctor ID' })
  @IsOptional()
  @IsMongoId()
  doctorId?: string;

  @ApiPropertyOptional({ description: 'Associated appointment ID' })
  @IsOptional()
  @IsMongoId()
  appointmentId?: string;

  @ApiPropertyOptional({ description: 'Associated medical record ID' })
  @IsOptional()
  @IsMongoId()
  medicalRecordId?: string;

  @ApiProperty({ enum: InvoiceType, example: InvoiceType.CONSULTATION })
  @IsEnum(InvoiceType)
  invoiceType: InvoiceType;

  @ApiPropertyOptional({ enum: InvoiceStatus, example: InvoiceStatus.DRAFT })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @ApiProperty({ type: [InvoiceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];

  @ApiProperty({ example: 150 })
  @IsNumber()
  @Min(0)
  subtotal: number;

  @ApiPropertyOptional({ example: 10, description: 'Discount percentage' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercent?: number;

  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @ApiPropertyOptional({ example: 10, description: 'Tax percentage' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  taxPercent?: number;

  @ApiPropertyOptional({ example: 13.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxAmount?: number;

  @ApiProperty({ example: 148.5 })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  @Min(0)
  paidAmount?: number;

  @ApiProperty({ example: 148.5 })
  @IsNumber()
  @Min(0)
  balanceAmount?: number;

  @ApiProperty({ example: '2024-04-15T10:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  issueDate: Date;

  @ApiPropertyOptional({ example: '2024-05-15T10:00:00.000Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @ApiPropertyOptional({ example: 'Payment for consultation services' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Late payment will incur 2% monthly interest' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'Bank transfer to Account #1234567890' })
  @IsOptional()
  @IsString()
  paymentInstructions?: string;

  @ApiPropertyOptional({ example: 'Insurance claim pending' })
  @IsOptional()
  @IsString()
  internalNotes?: string;

  @ApiPropertyOptional({ example: 'Blue Cross Insurance' })
  @IsOptional()
  @IsString()
  insuranceProvider?: string;

  @ApiPropertyOptional({ example: 'INS-987654' })
  @IsOptional()
  @IsString()
  insurancePolicyNumber?: string;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  insuranceCoverageAmount?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isInsuranceClaim?: boolean;
}
