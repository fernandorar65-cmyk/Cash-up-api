import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Loan } from '../../domain/entities/loan.entity';
import { LOAN_REPOSITORY } from '../ports/loan.repository.port';
import type { LoanRepositoryPort } from '../ports/loan.repository.port';

@Injectable()
export class GetLoanUseCase {
  constructor(
    @Inject(LOAN_REPOSITORY) private readonly loanRepo: LoanRepositoryPort,
  ) {}

  async execute(loanId: string): Promise<Loan> {
    const loan = await this.loanRepo.findById(loanId);
    if (!loan) {
      throw new NotFoundException(`Préstamo con id ${loanId} no encontrado`);
    }
    return loan;
  }
}
