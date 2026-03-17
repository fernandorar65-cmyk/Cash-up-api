import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanRefinance } from '../../domain/entities/loan-refinance.entity';
import type { LoanRefinanceRepositoryPort } from '../../application/ports/loan-refinance.repository.port';

@Injectable()
export class LoanRefinanceRepository implements LoanRefinanceRepositoryPort {
  constructor(
    @InjectRepository(LoanRefinance)
    private readonly repo: Repository<LoanRefinance>,
  ) {}

  async findById(id: string): Promise<LoanRefinance | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByOriginalLoanId(loanId: string): Promise<LoanRefinance | null> {
    return this.repo.findOne({ where: { originalLoanId: loanId } });
  }

  async save(loanRefinance: LoanRefinance): Promise<void> {
    await this.repo.save(loanRefinance);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
