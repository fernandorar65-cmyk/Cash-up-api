import { Controller, Get, Param } from '@nestjs/common';
import { GetCollectionActionUseCase } from '../application/use-cases/get-collection-action.use-case';
import { ListCollectionActionsByClientUseCase } from '../application/use-cases/list-collection-actions-by-client.use-case';
import { ListCollectionActionsByLoanUseCase } from '../application/use-cases/list-collection-actions-by-loan.use-case';

@Controller('collection-actions')
export class CollectionActionsController {
  constructor(
    private readonly getCollectionActionUseCase: GetCollectionActionUseCase,
    private readonly listByClientUseCase: ListCollectionActionsByClientUseCase,
    private readonly listByLoanUseCase: ListCollectionActionsByLoanUseCase,
  ) {}

  @Get('by-client/:clientId')
  async listByClient(@Param('clientId') clientId: string) {
    return this.listByClientUseCase.execute(clientId);
  }

  @Get('by-loan/:loanId')
  async listByLoan(@Param('loanId') loanId: string) {
    return this.listByLoanUseCase.execute(loanId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getCollectionActionUseCase.execute(id);
  }
}

