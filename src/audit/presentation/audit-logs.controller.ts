import { Controller, Get, Param } from '@nestjs/common';
import { GetAuditLogUseCase } from '../application/use-cases/get-audit-log.use-case';
import { ListAuditLogsByEntityUseCase } from '../application/use-cases/list-audit-logs-by-entity.use-case';

@Controller('audit-logs')
export class AuditLogsController {
  constructor(
    private readonly getAuditLogUseCase: GetAuditLogUseCase,
    private readonly listByEntityUseCase: ListAuditLogsByEntityUseCase,
  ) {}

  @Get('entity/:entityType/:entityId')
  async listByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.listByEntityUseCase.execute(entityType, entityId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getAuditLogUseCase.execute(id);
  }
}
