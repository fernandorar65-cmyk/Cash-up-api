import { Injectable } from '@nestjs/common';
import { AuditLogRepositoryPort } from '../../application/ports/audit-log.repository.port';

@Injectable()
export class AuditLogRepository implements AuditLogRepositoryPort {
  async findById(): Promise<null> {
    return null;
  }
  async findByEntity(): Promise<[]> {
    return [];
  }
  async save(): Promise<void> {}
}
