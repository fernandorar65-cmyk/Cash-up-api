import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
import { CurrentUser } from '../../iam/presentation/guards/current-user.decorator';
import type { RequestUser } from '../../iam/presentation/guards/jwt.strategy';
import { RolesGuard } from '../../iam/presentation/guards/roles.guard';
import { Roles } from '../../iam/presentation/guards/roles.decorator';
import { GetClientUseCase } from '../application/use-cases/get-client.use-case';
import { GetClientCreditProfileUseCase } from '../application/use-cases/get-client-credit-profile.use-case';
import { CreateClientUseCase } from '../application/use-cases/create-client.use-case';
import { RunInitialCreditEvaluationUseCase } from '../application/use-cases/run-initial-credit-evaluation.use-case';
import { GetMyClientUseCase } from '../application/use-cases/get-my-client.use-case';
import { UpdateMyClientUseCase } from '../application/use-cases/update-my-client.use-case';
import { ListClientEvaluationsUseCase } from '../application/use-cases/list-client-evaluations.use-case';
import { RunCreditEvaluationUseCase } from '../application/use-cases/run-credit-evaluation.use-case';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientHttpDto } from './dto/update-client.http.dto';
import { RunCreditEvaluationHttpDto } from './dto/run-credit-evaluation.http.dto';

@ApiTags('clients')
@ApiBearerAuth('access-token')
@Controller('clients')
export class ClientsController {
  constructor(
    private readonly getClientUseCase: GetClientUseCase,
    private readonly getClientCreditProfileUseCase: GetClientCreditProfileUseCase,
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly runInitialCreditEvaluationUseCase: RunInitialCreditEvaluationUseCase,
    private readonly getMyClientUseCase: GetMyClientUseCase,
    private readonly updateMyClientUseCase: UpdateMyClientUseCase,
    private readonly listClientEvaluationsUseCase: ListClientEvaluationsUseCase,
    private readonly runCreditEvaluationUseCase: RunCreditEvaluationUseCase,
  ) {}

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
    description:
      '1 = scoring positivo (aprobado), 2 = scoring negativo (no aprobado)',
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
  @ApiResponse({
    status: 409,
    description: 'Ya tienes perfil o el documento ya está registrado',
  })
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

  @Get('me')
  @UseGuards(RolesGuard)
  @Roles(RoleName.CLIENT)
  @ApiOperation({ summary: 'Mi perfil de cliente (cliente)' })
  async me(@CurrentUser() user: RequestUser) {
    return this.getMyClientUseCase.execute(user.userId);
  }

  @Patch('me')
  @UseGuards(RolesGuard)
  @Roles(RoleName.CLIENT)
  @ApiOperation({ summary: 'Actualizar mi perfil de cliente (cliente)' })
  async updateMe(@Body() dto: UpdateClientHttpDto, @CurrentUser() user: RequestUser) {
    return this.updateMyClientUseCase.execute({
      userId: user.userId,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      monthlyIncome: dto.monthlyIncome,
    });
  }

  @Get(':id/evaluations')
  @ApiOperation({ summary: 'Historial de evaluaciones (staff o dueño)' })
  async listEvaluations(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.listClientEvaluationsUseCase.execute(id, user.userId);
  }

  @Post(':id/evaluations')
  @UseGuards(RolesGuard)
  @Roles(RoleName.ANALYST, RoleName.ADMIN)
  @ApiOperation({ summary: 'Re-evaluar cliente (analyst/admin)' })
  async runEvaluation(
    @Param('id') id: string,
    @Body() dto: RunCreditEvaluationHttpDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.runCreditEvaluationUseCase.execute({
      clientId: id,
      evaluationOutcome: dto.evaluationOutcome,
      evaluatedByUserId: user.userId,
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

