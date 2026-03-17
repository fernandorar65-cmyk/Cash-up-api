import { Inject, Injectable } from '@nestjs/common';
import { Payment } from '../../domain/entities/payment.entity';
import { PAYMENT_REPOSITORY } from '../ports/payment.repository.port';
import type { PaymentRepositoryPort } from '../ports/payment.repository.port';

@Injectable()
export class ListPaymentsByLoanUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY) private readonly paymentRepo: PaymentRepositoryPort,
  ) {}

  async execute(loanId: string): Promise<Payment[]> {
    return this.paymentRepo.findByLoanId(loanId);
  }
}
