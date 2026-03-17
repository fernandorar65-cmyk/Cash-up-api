import { Controller, Get, Param } from '@nestjs/common';
import { GetClientUseCase } from '../application/use-cases/get-client.use-case';
import { GetClientCreditProfileUseCase } from '../application/use-cases/get-client-credit-profile.use-case';

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly getClientUseCase: GetClientUseCase,
    private readonly getClientCreditProfileUseCase: GetClientCreditProfileUseCase,
  ) {}

  @Get(':id/credit-profile')
  async getCreditProfile(@Param('id') id: string) {
    return this.getClientCreditProfileUseCase.execute(id);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getClientUseCase.execute(id);
  }
}
