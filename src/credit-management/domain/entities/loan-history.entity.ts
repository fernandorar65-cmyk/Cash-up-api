/**
 * Entidad de dominio: Historial de cambios del préstamo.
 * Credit Management. Mapeo TypeORM → tabla `loan_history`.
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('loan_history')
export class LoanHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'loan_id' })
  loanId: string;

  @Column({ type: 'varchar', length: 100 })
  action: string;

  @Column({ type: 'jsonb', name: 'previous_state', nullable: true })
  previousState: Record<string, unknown> | null;

  @Column({ type: 'jsonb', name: 'new_state', nullable: true })
  newState: Record<string, unknown> | null;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
