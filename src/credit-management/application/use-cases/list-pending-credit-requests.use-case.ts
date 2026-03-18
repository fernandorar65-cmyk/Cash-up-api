import { Inject, Injectable } from '@nestjs/common';
import { CreditRequestStatus } from '../../domain/enums/credit-request-status.enum';
import { CREDIT_REQUEST_REPOSITORY } from '../ports/credit-request.repository.port';
import type { CreditRequestRepositoryPort } from '../ports/credit-request.repository.port';

@Injectable()
export class ListPendingCreditRequestsUseCase {
  constructor(
    @Inject(CREDIT_REQUEST_REPOSITORY)
    private readonly creditRequestRepo: CreditRequestRepositoryPort,
  ) {}

  async execute() {
    const list = await this.creditRequestRepo.findByStatuses([
      CreditRequestStatus.PENDING,
      CreditRequestStatus.UNDER_REVIEW,
    ]);
    return list.map((r) => ({
      id: r.id,
      clientId: r.clientId,
      requestedAmount: Number(r.requestedAmount),
      termMonths: r.termMonths,
      currency: r.currency,
      purpose: r.purpose,
      clientNotes: r.clientNotes,
      evaluationId: r.evaluationId,
      status: r.status,
      createdAt: r.createdAt,
    }));
  }
}
