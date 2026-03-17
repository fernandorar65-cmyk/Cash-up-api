import { Inject, Injectable } from '@nestjs/common';
import { Installment } from '../../domain/entities/installment.entity';
import { INSTALLMENT_REPOSITORY } from '../ports/installment.repository.port';
import type { InstallmentRepositoryPort } from '../ports/installment.repository.port';

@Injectable()
export class ListInstallmentsByLoanUseCase {
  constructor(
    @Inject(INSTALLMENT_REPOSITORY)
    private readonly installmentRepo: InstallmentRepositoryPort,
  ) {}

  async execute(loanId: string): Promise<Installment[]> {
    return this.installmentRepo.findByLoanId(loanId);
  }
}
