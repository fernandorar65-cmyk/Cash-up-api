import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import { AUDIT_LOG_REPOSITORY } from '../ports/audit-log.repository.port';
import type { AuditLogRepositoryPort } from '../ports/audit-log.repository.port';

@Injectable()
export class GetAuditLogUseCase {
  constructor(
    @Inject(AUDIT_LOG_REPOSITORY)
    private readonly auditLogRepo: AuditLogRepositoryPort,
  ) {}

  async execute(id: string): Promise<AuditLog> {
    const log = await this.auditLogRepo.findById(id);
    if (!log) {
      throw new NotFoundException(`Auditoría con id ${id} no encontrada`);
    }
    return log;
  }
}
