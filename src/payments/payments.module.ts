import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './domain/entities/payment.entity';
import { PaymentApplication } from './domain/entities/payment-application.entity';
import {
  PAYMENT_REPOSITORY,
  PAYMENT_APPLICATION_REPOSITORY,
} from './application/ports';
import { PaymentRepository } from './infrastructure/persistence/payment.repository';
import { PaymentApplicationRepository } from './infrastructure/persistence/payment-application.repository';
import { GetPaymentUseCase } from './application/use-cases/get-payment.use-case';
import { ListPaymentsByLoanUseCase } from './application/use-cases/list-payments-by-loan.use-case';
import { ListPaymentApplicationsUseCase } from './application/use-cases/list-payment-applications.use-case';
import { PaymentsController } from './presentation/payments.controller';
import { LoansPaymentsController } from './presentation/loans-payments.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, PaymentApplication]),
  ],
  controllers: [PaymentsController, LoansPaymentsController],
  providers: [
    { provide: PAYMENT_REPOSITORY, useClass: PaymentRepository },
    {
      provide: PAYMENT_APPLICATION_REPOSITORY,
      useClass: PaymentApplicationRepository,
    },
    GetPaymentUseCase,
    ListPaymentsByLoanUseCase,
    ListPaymentApplicationsUseCase,
  ],
  exports: [PAYMENT_REPOSITORY, PAYMENT_APPLICATION_REPOSITORY],
})
export class PaymentsModule {}
