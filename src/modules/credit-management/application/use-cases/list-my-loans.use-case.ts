import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CLIENT_REPOSITORY } from '../../../risk-scoring/application/ports/client.repository.port';
import type { ClientRepositoryPort } from '../../../risk-scoring/application/ports/client.repository.port';
import type { ILoanRepository } from '../../domain/repositories/loan.repository';
import { CREDIT_MANAGEMENT_TOKENS } from '../ports/tokens';

@Injectable()
export class ListMyLoansUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY) private readonly clientRepo: ClientRepositoryPort,
    @Inject(CREDIT_MANAGEMENT_TOKENS.LOAN_REPOSITORY)
    private readonly loanRepo: ILoanRepository,
  ) {}

  async execute(userId: string) {
    const client = await this.clientRepo.findByUserId(userId);
    if (!client) throw new NotFoundException('No tienes perfil de cliente.');
    return this.loanRepo.findByClientId(client.id);
  }
}

