import { Module } from '@nestjs/common';
import {
  PAYMENT_REPOSITORY,
  PAYMENT_APPLICATION_REPOSITORY,
} from './application/ports';
import { PaymentRepository } from './infrastructure/persistence/payment.repository';
import { PaymentApplicationRepository } from './infrastructure/persistence/payment-application.repository';

@Module({
  providers: [
    { provide: PAYMENT_REPOSITORY, useClass: PaymentRepository },
    {
      provide: PAYMENT_APPLICATION_REPOSITORY,
      useClass: PaymentApplicationRepository,
    },
  ],
  exports: [PAYMENT_REPOSITORY, PAYMENT_APPLICATION_REPOSITORY],
})
export class PaymentsModule {}
