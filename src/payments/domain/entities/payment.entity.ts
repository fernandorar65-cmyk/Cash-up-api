/**
 * Entidad de dominio: Pago realizado.
 * Payments. Mapeo TypeORM → tabla `payments`.
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'client_id' })
  clientId: string;

  @Column({ type: 'uuid', name: 'loan_id' })
  loanId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 50 })
  method: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reference: string | null;

  @Column({ type: 'timestamp', name: 'paid_at' })
  paidAt: Date;

  @Column({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
