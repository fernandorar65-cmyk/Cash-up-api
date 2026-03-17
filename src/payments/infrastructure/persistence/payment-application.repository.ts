import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentApplication } from '../../domain/entities/payment-application.entity';
import type { PaymentApplicationRepositoryPort } from '../../application/ports/payment-application.repository.port';

@Injectable()
export class PaymentApplicationRepository
  implements PaymentApplicationRepositoryPort
{
  constructor(
    @InjectRepository(PaymentApplication)
    private readonly repo: Repository<PaymentApplication>,
  ) {}

  async findById(id: string): Promise<PaymentApplication | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByPaymentId(paymentId: string): Promise<PaymentApplication[]> {
    return this.repo.find({
      where: { paymentId },
      order: { appliedAt: 'ASC' },
    });
  }

  async save(paymentApplication: PaymentApplication): Promise<void> {
    await this.repo.save(paymentApplication);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
