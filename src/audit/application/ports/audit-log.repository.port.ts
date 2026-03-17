import { AuditLog } from '../../domain/entities/audit-log.entity';

export const AUDIT_LOG_REPOSITORY = Symbol('AuditLogRepository');

export interface AuditLogRepositoryPort {
  findById(id: string): Promise<AuditLog | null>;
  findByEntity(entityType: string, entityId: string): Promise<AuditLog[]>;
  save(auditLog: AuditLog): Promise<void>;
  delete(id: string): Promise<void>;
}
