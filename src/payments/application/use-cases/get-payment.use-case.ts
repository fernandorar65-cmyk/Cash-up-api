import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Payment } from '../../domain/entities/payment.entity';
import { PAYMENT_REPOSITORY } from '../ports/payment.repository.port';
import type { PaymentRepositoryPort } from '../ports/payment.repository.port';

@Injectable()
export class GetPaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY) private readonly paymentRepo: PaymentRepositoryPort,
  ) {}

  async execute(paymentId: string): Promise<Payment> {
    const payment = await this.paymentRepo.findById(paymentId);
    if (!payment) {
      throw new NotFoundException(`Pago con id ${paymentId} no encontrado`);
    }
    return payment;
  }
}
