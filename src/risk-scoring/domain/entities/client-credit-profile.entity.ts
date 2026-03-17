/**
 * Entidad de dominio: Perfil actual de crédito del cliente.
 * Risk & Scoring. Mapeo TypeORM → tabla `client_credit_profiles`.
 */
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('client_credit_profiles')
export class ClientCreditProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'client_id', unique: true })
  clientId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'current_score' })
  currentScore: number;

  @Column({ type: 'varchar', length: 50, name: 'risk_level' })
  riskLevel: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'total_debt' })
  totalDebt: number;

  @Column({ type: 'int', name: 'on_time_payments_count' })
  onTimePaymentsCount: number;

  @Column({ type: 'int', name: 'late_payments_count' })
  latePaymentsCount: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
