import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Installment } from '../../domain/entities/installment.entity';
import type { InstallmentRepositoryPort } from '../../application/ports/installment.repository.port';

@Injectable()
export class InstallmentRepository implements InstallmentRepositoryPort {
  constructor(
    @InjectRepository(Installment)
    private readonly repo: Repository<Installment>,
  ) {}

  async findById(id: string): Promise<Installment | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByLoanId(loanId: string): Promise<Installment[]> {
    return this.repo.find({
      where: { loanId },
      order: { dueDate: 'ASC' },
    });
  }

  async save(installment: Installment): Promise<void> {
    await this.repo.save(installment);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
