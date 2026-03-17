import { Payment } from '../../domain/entities/payment.entity';

export const PAYMENT_REPOSITORY = Symbol('PaymentRepository');

export interface PaymentRepositoryPort {
  findById(id: string): Promise<Payment | null>;
  findByLoanId(loanId: string): Promise<Payment[]>;
  findByClientId(clientId: string): Promise<Payment[]>;
  save(payment: Payment): Promise<void>;
  delete(id: string): Promise<void>;
}
