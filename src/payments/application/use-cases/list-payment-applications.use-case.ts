import { Inject, Injectable } from '@nestjs/common';
import { PaymentApplication } from '../../domain/entities/payment-application.entity';
import { PAYMENT_APPLICATION_REPOSITORY } from '../ports/payment-application.repository.port';
import type { PaymentApplicationRepositoryPort } from '../ports/payment-application.repository.port';

@Injectable()
export class ListPaymentApplicationsUseCase {
  constructor(
    @Inject(PAYMENT_APPLICATION_REPOSITORY)
    private readonly paymentApplicationRepo: PaymentApplicationRepositoryPort,
  ) {}

  async execute(paymentId: string): Promise<PaymentApplication[]> {
    return this.paymentApplicationRepo.findByPaymentId(paymentId);
  }
}
