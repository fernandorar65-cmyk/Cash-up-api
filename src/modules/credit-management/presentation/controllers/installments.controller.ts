import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../../common/filters/http-exception.filter';

import { GetInstallmentUseCase } from '../../application/use-cases/get-installment.use-case';

@Controller('installments')
@UseFilters(HttpExceptionFilter)
export class InstallmentsController {
  constructor(private readonly getInstallmentUseCase: GetInstallmentUseCase) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getInstallmentUseCase.execute(id);
  }
}

