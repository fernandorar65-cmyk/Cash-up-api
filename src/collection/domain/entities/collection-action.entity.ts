/**
 * Entidad de dominio: Gestión de cobranza.
 * Collection / Debt Recovery. Mapeo TypeORM → tabla `collection_actions`.
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('collection_actions')
export class CollectionAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'client_id' })
  clientId: string;

  @Column({ type: 'uuid', name: 'loan_id', nullable: true })
  loanId: string | null;

  @Column({ type: 'varchar', length: 50, name: 'action_type' })
  actionType: string;

  @Column({ type: 'varchar', length: 100 })
  result: string;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'timestamp', name: 'performed_at' })
  performedAt: Date;

  @Column({ type: 'uuid', name: 'performed_by_user_id' })
  performedByUserId: string;
}
