import { Controller, Get, Param } from '@nestjs/common';
import { GetInstallmentUseCase } from '../application/use-cases/get-installment.use-case';

@Controller('installments')
export class InstallmentsController {
  constructor(private readonly getInstallmentUseCase: GetInstallmentUseCase) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getInstallmentUseCase.execute(id);
  }
}
