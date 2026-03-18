/**
 * Entidad de dominio: Deuda externa.
 * Risk & Scoring. Mapeo TypeORM → tabla `external_debts`.
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('external_debts')
export class ExternalDebt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'client_id' })
  clientId: string;

  @Column({ type: 'varchar', length: 255, name: 'creditor_name' })
  creditorName: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'monthly_payment' })
  monthlyPayment: number;

  @Column({ type: 'timestamp', name: 'recorded_at' })
  recordedAt: Date;
}

