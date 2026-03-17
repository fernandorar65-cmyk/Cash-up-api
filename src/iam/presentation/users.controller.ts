import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GetUserUseCase } from '../application/use-cases/get-user.use-case';
import { GetUserRolesUseCase } from '../application/use-cases/get-user-roles.use-case';
import { RolesGuard } from '../infrastructure/auth/roles.guard';
import { Roles } from '../infrastructure/auth/roles.decorator';

@Controller('users')
@UseGuards(RolesGuard)
@Roles('admin', 'analyst')
export class UsersController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly getUserRolesUseCase: GetUserRolesUseCase,
  ) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getUserUseCase.execute(id);
  }

  @Get(':id/roles')
  async getRoles(@Param('id') id: string) {
    return this.getUserRolesUseCase.execute(id);
  }
}
