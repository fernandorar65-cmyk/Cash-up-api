/**
 * Entidad de dominio: Registro de auditoría.
 * Audit. Mapeo TypeORM → tabla `audit_logs`.
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  action: string;

  @Column({ type: 'varchar', length: 100, name: 'entity_type' })
  entityType: string;

  @Column({ type: 'uuid', name: 'entity_id' })
  entityId: string;

  @Column({ type: 'jsonb', name: 'old_values', nullable: true })
  oldValues: Record<string, unknown> | null;

  @Column({ type: 'jsonb', name: 'new_values', nullable: true })
  newValues: Record<string, unknown> | null;

  @Column({ type: 'uuid', name: 'user_id', nullable: true })
  userId: string | null;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip: string | null;

  @Column({ type: 'text', name: 'user_agent', nullable: true })
  userAgent: string | null;

  @Column({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
