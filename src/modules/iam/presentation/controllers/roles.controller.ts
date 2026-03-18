import { Controller, Get, Param, UseFilters, UseGuards } from '@nestjs/common';
import { RoleName } from '../../domain/enums/role-name.enum';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { GetRoleUseCase } from '../../application/use-cases/get-role.use-case';
import { ListRolesUseCase } from '../../application/use-cases/list-roles.use-case';
import { HttpExceptionFilter } from '../../../../common/filters/http-exception.filter';

@Controller('roles')
@UseFilters(HttpExceptionFilter)
@UseGuards(RolesGuard)
@Roles(RoleName.ADMIN, RoleName.ANALYST)
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

