import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { InvoiceService } from './invoice.service';
import { PaymentService } from './payment.service';
import { InvoiceController } from './invoice.controller';
import { PaymentController } from './payment.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
  ],
  controllers: [InvoiceController, PaymentController],
  providers: [InvoiceService, PaymentService],
  exports: [InvoiceService, PaymentService, MongooseModule],
})
export class BillingModule {}
