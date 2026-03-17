import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetLoanUseCase } from '../application/use-cases/get-loan.use-case';
import { ListLoansByClientUseCase } from '../application/use-cases/list-loans-by-client.use-case';
import { ListLoansByStatusUseCase } from '../application/use-cases/list-loans-by-status.use-case';
import { ListInstallmentsByLoanUseCase } from '../application/use-cases/list-installments-by-loan.use-case';

@Controller('loans')
export class LoansController {
  constructor(
    private readonly getLoanUseCase: GetLoanUseCase,
    private readonly listLoansByClientUseCase: ListLoansByClientUseCase,
    private readonly listLoansByStatusUseCase: ListLoansByStatusUseCase,
    private readonly listInstallmentsByLoanUseCase: ListInstallmentsByLoanUseCase,
  ) {}

  @Get()
  async list(
    @Query('clientId') clientId?: string,
    @Query('status') status?: string,
  ) {
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
