import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { RoleName } from '../../iam/domain/enums/role-name.enum';
import { CurrentUser } from '../../iam/infrastructure/auth/current-user.decorator';
import type { RequestUser } from '../../iam/infrastructure/auth/jwt.strategy';
import { RolesGuard } from '../../iam/infrastructure/auth/roles.guard';
import { Roles } from '../../iam/infrastructure/auth/roles.decorator';
import { GetClientUseCase } from '../application/use-cases/get-client.use-case';
import { GetClientCreditProfileUseCase } from '../application/use-cases/get-client-credit-profile.use-case';
import { CreateClientUseCase } from '../application/use-cases/create-client.use-case';
import { RunInitialCreditEvaluationUseCase } from '../application/use-cases/run-initial-credit-evaluation.use-case';
import { CreateClientDto } from './dto/create-client.dto';

@ApiTags('clients')
@ApiBearerAuth('access-token')
@Controller('clients')
export class ClientsController {
  constructor(
    private readonly getClientUseCase: GetClientUseCase,
    private readonly getClientCreditProfileUseCase: GetClientCreditProfileUseCase,
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly runInitialCreditEvaluationUseCase: RunInitialCreditEvaluationUseCase,
  ) { }

  @Post(':evaluationOutcome')
  @UseGuards(RolesGuard)
  @Roles(RoleName.CLIENT)
  @ApiOperation({
    summary: 'Crear cliente con scoring forzado (1=positivo, 2=negativo)',
    description:
      'Misma creación que POST /clients, pero el resultado de la evaluación simulada es fijo: 1 aprueba, 2 rechaza (valores numéricos dentro de rangos simulados).',
  })
  @ApiParam({
    name: 'evaluationOutcome',
    enum: ['1', '2'],
    description: '1 = scoring positivo (aprobado), 2 = scoring negativo (no aprobado)',
  })
  @ApiResponse({ status: 201, description: 'Cliente y evaluación creados' })
  async createWithEvaluationOutcome(
    @Param('evaluationOutcome') evaluationOutcome: string,
    @Body() dto: CreateClientDto,
    @CurrentUser() user: RequestUser,
  ) {
    if (evaluationOutcome !== '1' && evaluationOutcome !== '2') {
      throw new BadRequestException(
        'evaluationOutcome debe ser 1 (scoring positivo) o 2 (scoring negativo). Use POST /clients para resultado aleatorio.',
      );
    }
    const client = await this.createClientUseCase.execute({
      userId: user.userId,
      documentType: dto.documentType,
      documentNumber: dto.documentNumber,
      name: dto.name,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      monthlyIncome: dto.monthlyIncome,
    });
    const evaluation = await this.runInitialCreditEvaluationUseCase.execute({
      clientId: client.id,
      evaluationOutcome: evaluationOutcome === '1' ? 1 : 2,
    });
    return { ...client, evaluation };
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(RoleName.CLIENT)
  @ApiOperation({
    summary: 'Crear perfil de cliente (solo rol client)',
    description:
      'Completa datos del solicitante. Se crea automáticamente una evaluación de crédito simulada (buros/antecedentes aleatorios). Para forzar resultado use POST /clients/1 o /clients/2.',
  })
  @ApiResponse({
    status: 201,
    description: 'Perfil creado con evaluación inicial simulada',
  })
  @ApiResponse({ status: 409, description: 'Ya tienes perfil o el documento ya está registrado' })
  async create(@Body() dto: CreateClientDto, @CurrentUser() user: RequestUser) {
    const client = await this.createClientUseCase.execute({
      userId: user.userId,
      documentType: dto.documentType,
      documentNumber: dto.documentNumber,
      name: dto.name,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      monthlyIncome: dto.monthlyIncome,
    });
    const evaluation = await this.runInitialCreditEvaluationUseCase.execute({
      clientId: client.id,
    });
    return { ...client, evaluation };
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
