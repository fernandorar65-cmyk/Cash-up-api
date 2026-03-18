import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { GetLoanUseCase } from '../../application/use-cases/get-loan.use-case';
import { ListLoansByClientUseCase } from '../../application/use-cases/list-loans-by-client.use-case';
import { ListLoansByStatusUseCase } from '../../application/use-cases/list-loans-by-status.use-case';
import { ListInstallmentsByLoanUseCase } from '../../application/use-cases/list-installments-by-loan.use-case';
import { ListMyLoansUseCase } from '../../application/use-cases/list-my-loans.use-case';
import { RolesGuard } from '../../../iam/presentation/guards/roles.guard';
import { Roles } from '../../../iam/presentation/guards/roles.decorator';
import { RoleName } from '../../../iam/domain/enums/role-name.enum';
import { CurrentUser } from '../../../iam/presentation/guards/current-user.decorator';
import type { RequestUser } from '../../../iam/presentation/guards/jwt.strategy';

@Controller('loans')
export class LoansController {
  constructor(
    private readonly getLoanUseCase: GetLoanUseCase,
    private readonly listLoansByClientUseCase: ListLoansByClientUseCase,
    private readonly listLoansByStatusUseCase: ListLoansByStatusUseCase,
    private readonly listInstallmentsByLoanUseCase: ListInstallmentsByLoanUseCase,
    private readonly listMyLoansUseCase: ListMyLoansUseCase,
  ) {}

  @Get('my')
  @UseGuards(RolesGuard)
  @Roles(RoleName.CLIENT)
  async my(@CurrentUser() user: RequestUser) {
    return this.listMyLoansUseCase.execute(user.userId);
  }

  @Get()
  async list(@Query('clientId') clientId?: string, @Query('status') status?: string) {
    if (clientId) {
      return this.listLoansByClientUseCase.execute(clientId);
    }
    if (status) {
      return this.listLoansByStatusUseCase.execute(status);
    }
    return [];
  }

  @Get(':loanId/installments')
  async getInstallments(@Param('loanId') loanId: string) {
    return this.listInstallmentsByLoanUseCase.execute(loanId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getLoanUseCase.execute(id);
  }
}

