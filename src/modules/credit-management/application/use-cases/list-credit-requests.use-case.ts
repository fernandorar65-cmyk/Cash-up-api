import { Inject, Injectable } from '@nestjs/common';
import type { ICreditRequestRepository } from '../../domain/repositories/credit-request.repository';
import { CREDIT_MANAGEMENT_TOKENS } from '../ports/tokens';
import { CreditRequestStatus } from '../../domain/enums/credit-request-status.enum';

export interface ListCreditRequestsQuery {
  clientId?: string;
  status?: CreditRequestStatus;
  from?: Date;
  to?: Date;
}

@Injectable()
export class ListCreditRequestsUseCase {
  constructor(
    @Inject(CREDIT_MANAGEMENT_TOKENS.CREDIT_REQUEST_REPOSITORY)
    private readonly creditRequestRepo: ICreditRequestRepository,
  ) {}

  async execute(query: ListCreditRequestsQuery) {
    return this.creditRequestRepo.findFiltered(query);
  }
}

