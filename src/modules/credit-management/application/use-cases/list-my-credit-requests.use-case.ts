import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CLIENT_REPOSITORY } from '../../../risk-scoring/application/ports/client.repository.port';
import type { ClientRepositoryPort } from '../../../risk-scoring/application/ports/client.repository.port';
import { CREDIT_MANAGEMENT_TOKENS } from '../ports/tokens';
import type { ICreditRequestRepository } from '../../domain/repositories/credit-request.repository';

@Injectable()
export class ListMyCreditRequestsUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY) private readonly clientRepo: ClientRepositoryPort,
    @Inject(CREDIT_MANAGEMENT_TOKENS.CREDIT_REQUEST_REPOSITORY)
    private readonly creditRequestRepo: ICreditRequestRepository,
  ) {}

  async execute(userId: string) {
    const client = await this.clientRepo.findByUserId(userId);
    if (!client) {
      throw new NotFoundException('No tienes perfil de cliente.');
    }
    const list = await this.creditRequestRepo.findByClientId(client.id);
    return list.map((r) => ({
      id: r.id,
      requestedAmount: Number(r.requestedAmount),
      termMonths: r.termMonths,
      currency: r.currency,
      purpose: r.purpose,
      status: r.status,
      loanId: r.loanId,
      rejectionReason: r.rejectionReason,
      createdAt: r.createdAt,
      reviewedAt: r.reviewedAt,
    }));
  }
}

