import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CLIENT_REPOSITORY } from '../../../risk-scoring/application/ports/client.repository.port';
import type { ClientRepositoryPort } from '../../../risk-scoring/application/ports/client.repository.port';
import type { ILoanRepository } from '../../domain/repositories/loan.repository';
import type { IInstallmentRepository } from '../../domain/repositories/installment.repository';
import { CREDIT_MANAGEMENT_TOKENS } from '../ports/tokens';

export type InstallmentStatusFilter = 'PENDING' | 'PAID' | 'OVERDUE';

@Injectable()
export class ListMyInstallmentsUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY) private readonly clientRepo: ClientRepositoryPort,
    @Inject(CREDIT_MANAGEMENT_TOKENS.LOAN_REPOSITORY)
    private readonly loanRepo: ILoanRepository,
    @Inject(CREDIT_MANAGEMENT_TOKENS.INSTALLMENT_REPOSITORY)
    private readonly installmentRepo: IInstallmentRepository,
  ) {}

  async execute(params: { userId: string; status?: InstallmentStatusFilter }) {
    const client = await this.clientRepo.findByUserId(params.userId);
    if (!client) throw new NotFoundException('No tienes perfil de cliente.');

    const loans = await this.loanRepo.findByClientId(client.id);
    const all: Awaited<ReturnType<IInstallmentRepository['findByLoanId']>> = [];
    for (const loan of loans) {
      const list = await this.installmentRepo.findByLoanId(loan.id);
      all.push(...list);
    }

    if (!params.status) return all;

    const now = new Date();
    switch (params.status) {
      case 'PENDING':
        return all.filter((i) => i.status === 'PENDING');
      case 'PAID':
        return all.filter((i) => i.status === 'PAID');
      case 'OVERDUE':
        return all.filter(
          (i) => i.status === 'PENDING' && i.dueDate && new Date(i.dueDate) < now,
        );
      default:
        return all;
    }
  }
}

