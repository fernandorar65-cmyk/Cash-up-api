import { Inject, Injectable } from '@nestjs/common';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import { AUDIT_LOG_REPOSITORY } from '../ports/audit-log.repository.port';
import type { AuditLogRepositoryPort } from '../ports/audit-log.repository.port';

@Injectable()
export class ListAuditLogsByEntityUseCase {
  constructor(
    @Inject(AUDIT_LOG_REPOSITORY)
    private readonly auditLogRepo: AuditLogRepositoryPort,
  ) {}

  async execute(entityType: string, entityId: string): Promise<AuditLog[]> {
    return this.auditLogRepo.findByEntity(entityType, entityId);
  }
}
