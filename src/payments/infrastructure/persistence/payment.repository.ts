import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../domain/entities/payment.entity';
import type { PaymentRepositoryPort } from '../../application/ports/payment.repository.port';

@Injectable()
export class PaymentRepository implements PaymentRepositoryPort {
  constructor(
    @InjectRepository(Payment)
    private readonly repo: Repository<Payment>,
  ) {}

  async findById(id: string): Promise<Payment | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByLoanId(loanId: string): Promise<Payment[]> {
    return this.repo.find({
      where: { loanId },
      order: { paidAt: 'DESC' },
    });
  }

  async findByClientId(clientId: string): Promise<Payment[]> {
    return this.repo.find({
      where: { clientId },
      order: { paidAt: 'DESC' },
    });
  }

  async save(payment: Payment): Promise<void> {
    await this.repo.save(payment);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
