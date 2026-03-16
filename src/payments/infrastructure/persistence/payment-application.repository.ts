import { Injectable } from '@nestjs/common';
import { PaymentApplicationRepositoryPort } from '../../application/ports/payment-application.repository.port';

@Injectable()
export class PaymentApplicationRepository
  implements PaymentApplicationRepositoryPort
{
  async findById(): Promise<null> {
    return null;
  }
  async findByPaymentId(): Promise<[]> {
    return [];
  }
  async save(): Promise<void> {}
}
