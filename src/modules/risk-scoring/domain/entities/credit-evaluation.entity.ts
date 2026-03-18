/**
 * Entidad de dominio: Evaluación de riesgo.
 * Risk & Scoring. Mapeo TypeORM → tabla `credit_evaluations`.
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('credit_evaluations')
export class CreditEvaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'client_id' })
  clientId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  score: number;

  @Column({ type: 'boolean' })
  approved: boolean;

  @Column({ type: 'jsonb' })
  factors: Record<string, unknown>;

  @Column({ type: 'timestamp', name: 'evaluated_at' })
  evaluatedAt: Date;

  @Column({ type: 'uuid', name: 'evaluated_by_user_id', nullable: true })
  evaluatedByUserId: string | null;
}

