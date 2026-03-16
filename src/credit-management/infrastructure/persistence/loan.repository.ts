import { Injectable } from '@nestjs/common';
import { LoanRepositoryPort } from '../../application/ports/loan.repository.port';

@Injectable()
export class LoanRepository implements LoanRepositoryPort {
  async findById(): Promise<null> {
    return null;
  }
  async findByClientId(): Promise<[]> {
    return [];
  }
  async findByStatus(): Promise<[]> {
    return [];
  }
  async save(): Promise<void> {}
}
