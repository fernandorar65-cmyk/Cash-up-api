import { Injectable } from '@nestjs/common';
import { InstallmentRepositoryPort } from '../../application/ports/installment.repository.port';

@Injectable()
export class InstallmentRepository implements InstallmentRepositoryPort {
  async findById(): Promise<null> {
    return null;
  }
  async findByLoanId(): Promise<[]> {
    return [];
  }
  async save(): Promise<void> {}
}
