import { Inject, Injectable } from '@nestjs/common';
import { CREDIT_MANAGEMENT_TOKENS } from '../ports/tokens';
import type { ILoanRepository } from '../../domain/repositories/loan.repository';

@Injectable()
export class ListLoansByClientUseCase {
  constructor(
    @Inject(CREDIT_MANAGEMENT_TOKENS.LOAN_REPOSITORY)
    private readonly loanRepo: ILoanRepository,
  ) {}

  async execute(clientId: string) {
    return this.loanRepo.findByClientId(clientId);
  }
}

