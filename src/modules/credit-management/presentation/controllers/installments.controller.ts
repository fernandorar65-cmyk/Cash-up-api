import { Controller, Get, Param, Query, UseFilters, UseGuards } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../../common/filters/http-exception.filter';

import { GetInstallmentUseCase } from '../../application/use-cases/get-installment.use-case';
import { ListMyInstallmentsUseCase } from '../../application/use-cases/list-my-installments.use-case';
import type { InstallmentStatusFilter } from '../../application/use-cases/list-my-installments.use-case';
import { RolesGuard } from '../../../iam/presentation/guards/roles.guard';
import { Roles } from '../../../iam/presentation/guards/roles.decorator';
import { RoleName } from '../../../iam/domain/enums/role-name.enum';
import { CurrentUser } from '../../../iam/presentation/guards/current-user.decorator';
import type { RequestUser } from '../../../iam/presentation/guards/jwt.strategy';

@Controller('installments')
@UseFilters(HttpExceptionFilter)
export class InstallmentsController {
  constructor(
    private readonly getInstallmentUseCase: GetInstallmentUseCase,
    private readonly listMyInstallmentsUseCase: ListMyInstallmentsUseCase,
  ) {}

  @Get('my')
  @UseGuards(RolesGuard)
  @Roles(RoleName.CLIENT)
  async my(
    @CurrentUser() user: RequestUser,
    @Query('status') status?: InstallmentStatusFilter,
  ) {
    return this.listMyInstallmentsUseCase.execute({ userId: user.userId, status });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getInstallmentUseCase.execute(id);
  }
}

