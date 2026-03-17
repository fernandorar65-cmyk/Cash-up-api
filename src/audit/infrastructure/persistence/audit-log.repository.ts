import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import type { AuditLogRepositoryPort } from '../../application/ports/audit-log.repository.port';

@Injectable()
export class AuditLogRepository implements AuditLogRepositoryPort {
  constructor(
    @InjectRepository(AuditLog)
    private readonly repo: Repository<AuditLog>,
  ) {}

  async findById(id: string): Promise<AuditLog | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByEntity(
    entityType: string,
    entityId: string,
  ): Promise<AuditLog[]> {
    return this.repo.find({
      where: { entityType, entityId },
      order: { createdAt: 'DESC' },
    });
  }

  async save(auditLog: AuditLog): Promise<void> {
    await this.repo.save(auditLog);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
