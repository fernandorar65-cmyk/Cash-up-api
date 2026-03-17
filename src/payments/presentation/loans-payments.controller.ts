import { Controller, Get, Param } from '@nestjs/common';
import { ListPaymentsByLoanUseCase } from '../application/use-cases/list-payments-by-loan.use-case';

@Controller('loans')
export class LoansPaymentsController {
  constructor(
    private readonly listPaymentsByLoanUseCase: ListPaymentsByLoanUseCase,
  ) {}

  @Get(':loanId/payments')
  async listByLoan(@Param('loanId') loanId: string) {
    return this.listPaymentsByLoanUseCase.execute(loanId);
  }
}
