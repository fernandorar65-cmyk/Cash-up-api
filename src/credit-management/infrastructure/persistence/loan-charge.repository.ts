import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanCharge } from '../../domain/entities/loan-charge.entity';
import type { LoanChargeRepositoryPort } from '../../application/ports/loan-charge.repository.port';

@Injectable()
export class LoanChargeRepository implements LoanChargeRepositoryPort {
  constructor(
    @InjectRepository(LoanCharge)
    private readonly repo: Repository<LoanCharge>,
  ) {}

  async findById(id: string): Promise<LoanCharge | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByLoanId(loanId: string): Promise<LoanCharge[]> {
    return this.repo.find({
      where: { loanId },
      order: { createdAt: 'ASC' },
    });
  }

  async save(loanCharge: LoanCharge): Promise<void> {
    await this.repo.save(loanCharge);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
