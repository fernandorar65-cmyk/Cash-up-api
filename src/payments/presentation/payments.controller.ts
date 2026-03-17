import { Controller, Get, Param } from '@nestjs/common';
import { GetPaymentUseCase } from '../application/use-cases/get-payment.use-case';
import { ListPaymentsByLoanUseCase } from '../application/use-cases/list-payments-by-loan.use-case';
import { ListPaymentApplicationsUseCase } from '../application/use-cases/list-payment-applications.use-case';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly getPaymentUseCase: GetPaymentUseCase,
    private readonly listPaymentsByLoanUseCase: ListPaymentsByLoanUseCase,
    private readonly listPaymentApplicationsUseCase: ListPaymentApplicationsUseCase,
  ) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getPaymentUseCase.execute(id);
  }

  @Get(':id/applications')
  async getApplications(@Param('id') id: string) {
    return this.listPaymentApplicationsUseCase.execute(id);
  }
}
