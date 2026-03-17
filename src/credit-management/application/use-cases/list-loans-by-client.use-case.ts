import { Inject, Injectable } from '@nestjs/common';
import { Loan } from '../../domain/entities/loan.entity';
import { LOAN_REPOSITORY } from '../ports/loan.repository.port';
import type { LoanRepositoryPort } from '../ports/loan.repository.port';

@Injectable()
export class ListLoansByClientUseCase {
  constructor(
    @Inject(LOAN_REPOSITORY) private readonly loanRepo: LoanRepositoryPort,
  ) {}

  async execute(clientId: string): Promise<Loan[]> {
    return this.loanRepo.findByClientId(clientId);
  }
}
