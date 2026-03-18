/**
 * Entidad de dominio: Historial del puntaje del cliente.
 * Risk & Scoring. Mapeo TypeORM → tabla `credit_score_history`.
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('credit_score_history')
export class CreditScoreHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'client_id' })
  clientId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  score: number;

  @Column({ type: 'timestamp', name: 'recorded_at' })
  recordedAt: Date;
}

