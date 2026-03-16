import { Injectable } from '@nestjs/common';
import { PaymentRepositoryPort } from '../../application/ports/payment.repository.port';

@Injectable()
export class PaymentRepository implements PaymentRepositoryPort {
  async findById(): Promise<null> {
    return null;
  }
  async findByLoanId(): Promise<[]> {
    return [];
  }
  async findByClientId(): Promise<[]> {
    return [];
  }
  async save(): Promise<void> {}
}
