import { Module } from '@nestjs/common';
import { AUDIT_LOG_REPOSITORY } from './application/ports';
import { AuditLogRepository } from './infrastructure/persistence/audit-log.repository';

@Module({
  providers: [
    { provide: AUDIT_LOG_REPOSITORY, useClass: AuditLogRepository },
  ],
  exports: [AUDIT_LOG_REPOSITORY],
})
export class AuditModule {}
