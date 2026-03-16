import { PaymentApplication } from '../../domain/entities/payment-application.entity';

export const PAYMENT_APPLICATION_REPOSITORY = Symbol(
  'PaymentApplicationRepository',
);

export interface PaymentApplicationRepositoryPort {
  findById(id: string): Promise<PaymentApplication | null>;
  findByPaymentId(paymentId: string): Promise<PaymentApplication[]>;
  save(paymentApplication: PaymentApplication): Promise<void>;
}
