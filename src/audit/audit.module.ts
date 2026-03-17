import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './domain/entities/audit-log.entity';
import { AUDIT_LOG_REPOSITORY } from './application/ports';
import { AuditLogRepository } from './infrastructure/persistence/audit-log.repository';
import { GetAuditLogUseCase } from './application/use-cases/get-audit-log.use-case';
import { ListAuditLogsByEntityUseCase } from './application/use-cases/list-audit-logs-by-entity.use-case';
import { AuditLogsController } from './presentation/audit-logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  controllers: [AuditLogsController],
  providers: [
    { provide: AUDIT_LOG_REPOSITORY, useClass: AuditLogRepository },
    GetAuditLogUseCase,
    ListAuditLogsByEntityUseCase,
  ],
  exports: [AUDIT_LOG_REPOSITORY],
})
export class AuditModule {}
