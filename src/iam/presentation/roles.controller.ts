import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GetRoleUseCase } from '../application/use-cases/get-role.use-case';
import { ListRolesUseCase } from '../application/use-cases/list-roles.use-case';
import { RolesGuard } from '../infrastructure/auth/roles.guard';
import { Roles } from '../infrastructure/auth/roles.decorator';

@Controller('roles')
@UseGuards(RolesGuard)
@Roles('admin', 'analyst')
export class RolesController {
  constructor(
    private readonly getRoleUseCase: GetRoleUseCase,
    private readonly listRolesUseCase: ListRolesUseCase,
  ) {}

  @Get()
  async list() {
    return this.listRolesUseCase.execute();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getRoleUseCase.execute(id);
  }
}
