import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CREDIT_MANAGEMENT_TOKENS } from '../ports/tokens';
import type { ILoanRepository } from '../../domain/repositories/loan.repository';

@Injectable()
export class GetLoanUseCase {
  constructor(
    @Inject(CREDIT_MANAGEMENT_TOKENS.LOAN_REPOSITORY)
    private readonly loanRepo: ILoanRepository,
  ) {}

  async execute(loanId: string) {
    const loan = await this.loanRepo.findById(loanId);
    if (!loan) {
      throw new NotFoundException(`Préstamo con id ${loanId} no encontrado`);
    }
    return loan;
  }
}

