import { Injectable } from '@nestjs/common';
import { LoanHistoryRepositoryPort } from '../../application/ports/loan-history.repository.port';

@Injectable()
export class LoanHistoryRepository implements LoanHistoryRepositoryPort {
  async findById(): Promise<null> {
    return null;
  }
  async findByLoanId(): Promise<[]> {
    return [];
  }
  async save(): Promise<void> {}
}
