import { Inject, Injectable } from '@nestjs/common';
import { CreditRequestStatus } from '../../domain/enums/credit-request-status.enum';
import { CREDIT_MANAGEMENT_TOKENS } from '../ports/tokens';
import type { ICreditRequestRepository } from '../../domain/repositories/credit-request.repository';

@Injectable()
export class ListPendingCreditRequestsUseCase {
  constructor(
    @Inject(CREDIT_MANAGEMENT_TOKENS.CREDIT_REQUEST_REPOSITORY)
    private readonly creditRequestRepo: ICreditRequestRepository,
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

