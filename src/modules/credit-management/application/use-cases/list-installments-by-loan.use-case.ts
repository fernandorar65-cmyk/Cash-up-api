import { Inject, Injectable } from '@nestjs/common';
import { CREDIT_MANAGEMENT_TOKENS } from '../ports/tokens';
import type { IInstallmentRepository } from '../../domain/repositories/installment.repository';

@Injectable()
export class ListInstallmentsByLoanUseCase {
  constructor(
    @Inject(CREDIT_MANAGEMENT_TOKENS.INSTALLMENT_REPOSITORY)
    private readonly installmentRepo: IInstallmentRepository,
  ) {}

  async execute(loanId: string) {
    return this.installmentRepo.findByLoanId(loanId);
  }
}

