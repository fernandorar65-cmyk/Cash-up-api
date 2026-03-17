/**
 * Entidad de dominio: Distribución del pago en principal, interés y mora.
 * Payments. Mapeo TypeORM → tabla `payment_applications`.
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('payment_applications')
export class PaymentApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'payment_id' })
  paymentId: string;

  @Column({ type: 'uuid', name: 'installment_id' })
  installmentId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'principal_amount' })
  principalAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'interest_amount' })
  interestAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'late_fee_amount' })
  lateFeeAmount: number;

  @Column({ type: 'timestamp', name: 'applied_at' })
  appliedAt: Date;
}
