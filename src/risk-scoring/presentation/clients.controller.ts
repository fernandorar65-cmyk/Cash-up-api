import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoleName } from '../../iam/domain/enums/role-name.enum';
import { CurrentUser } from '../../iam/infrastructure/auth/current-user.decorator';
import type { RequestUser } from '../../iam/infrastructure/auth/jwt.strategy';
import { RolesGuard } from '../../iam/infrastructure/auth/roles.guard';
import { Roles } from '../../iam/infrastructure/auth/roles.decorator';
import { GetClientUseCase } from '../application/use-cases/get-client.use-case';
import { GetClientCreditProfileUseCase } from '../application/use-cases/get-client-credit-profile.use-case';
import { CreateClientUseCase } from '../application/use-cases/create-client.use-case';
import { CreateClientDto } from './dto/create-client.dto';

@ApiTags('clients')
@ApiBearerAuth('access-token')
@Controller('clients')
export class ClientsController {
  constructor(
    private readonly getClientUseCase: GetClientUseCase,
    private readonly getClientCreditProfileUseCase: GetClientCreditProfileUseCase,
    private readonly createClientUseCase: CreateClientUseCase,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(RoleName.CLIENT)
  @ApiOperation({
    summary: 'Crear perfil de cliente (solo rol client)',
    description: 'El usuario logueado con rol client completa sus datos para ser evaluado. Un usuario solo puede tener un perfil.',
  })
  @ApiResponse({ status: 201, description: 'Perfil de cliente creado' })
  @ApiResponse({ status: 409, description: 'Ya tienes perfil o el documento ya está registrado' })
  async create(@Body() dto: CreateClientDto, @CurrentUser() user: RequestUser) {
    return this.createClientUseCase.execute({
      userId: user.userId,
      documentType: dto.documentType,
      documentNumber: dto.documentNumber,
      name: dto.name,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      monthlyIncome: dto.monthlyIncome,
    });
  }

  @Get(':id/credit-profile')
  @ApiOperation({ summary: 'Obtener perfil de crédito del cliente' })
  async getCreditProfile(@Param('id') id: string) {
    return this.getClientCreditProfileUseCase.execute(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener cliente por ID' })
  async getById(@Param('id') id: string) {
    return this.getClientUseCase.execute(id);
  }
}
