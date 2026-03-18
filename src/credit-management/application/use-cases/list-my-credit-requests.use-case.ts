import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CLIENT_REPOSITORY } from '../../../risk-scoring/application/ports/client.repository.port';
import type { ClientRepositoryPort } from '../../../risk-scoring/application/ports/client.repository.port';
import { CREDIT_REQUEST_REPOSITORY } from '../ports/credit-request.repository.port';
import type { CreditRequestRepositoryPort } from '../ports/credit-request.repository.port';

@Injectable()
export class ListMyCreditRequestsUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY) private readonly clientRepo: ClientRepositoryPort,
    @Inject(CREDIT_REQUEST_REPOSITORY)
    private readonly creditRequestRepo: CreditRequestRepositoryPort,
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
