/**
 * Entidad de dominio: Penalidad por atraso en cuota.
 * Credit Management. Mapeo TypeORM → tabla `late_fees`.
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('late_fees')
export class LateFee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'installment_id' })
  installmentId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp', name: 'applied_at' })
  appliedAt: Date;

  @Column({ type: 'uuid', name: 'penalty_policy_id' })
  penaltyPolicyId: string;
}
