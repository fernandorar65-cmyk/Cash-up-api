import { Injectable } from '@nestjs/common';
import { LoanRefinanceRepositoryPort } from '../../application/ports/loan-refinance.repository.port';

@Injectable()
export class LoanRefinanceRepository implements LoanRefinanceRepositoryPort {
  async findById(): Promise<null> {
    return null;
  }
  async findByOriginalLoanId(): Promise<null> {
    return null;
  }
  async save(): Promise<void> {}
}
