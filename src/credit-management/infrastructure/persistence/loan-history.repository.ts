import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanHistory } from '../../domain/entities/loan-history.entity';
import type { LoanHistoryRepositoryPort } from '../../application/ports/loan-history.repository.port';

@Injectable()
export class LoanHistoryRepository implements LoanHistoryRepositoryPort {
  constructor(
    @InjectRepository(LoanHistory)
    private readonly repo: Repository<LoanHistory>,
  ) {}

  async findById(id: string): Promise<LoanHistory | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByLoanId(loanId: string): Promise<LoanHistory[]> {
    return this.repo.find({
      where: { loanId },
      order: { createdAt: 'DESC' },
    });
  }

  async save(loanHistory: LoanHistory): Promise<void> {
    await this.repo.save(loanHistory);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
