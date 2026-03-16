import { Injectable } from '@nestjs/common';
import { LoanChargeRepositoryPort } from '../../application/ports/loan-charge.repository.port';

@Injectable()
export class LoanChargeRepository implements LoanChargeRepositoryPort {
  async findById(): Promise<null> {
    return null;
  }
  async findByLoanId(): Promise<[]> {
    return [];
  }
  async save(): Promise<void> {}
}
