import {
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
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { RoleName } from '../../modules/iam/domain/enums/role-name.enum';
import { CurrentUser } from '../../modules/iam/presentation/guards/current-user.decorator';
import type { RequestUser } from '../../modules/iam/presentation/guards/jwt.strategy';
import { RolesGuard } from '../../modules/iam/presentation/guards/roles.guard';
import { Roles } from '../../modules/iam/presentation/guards/roles.decorator';
import { CreateCreditRequestUseCase } from '../application/use-cases/create-credit-request.use-case';
import { ListMyCreditRequestsUseCase } from '../application/use-cases/list-my-credit-requests.use-case';
import { ListPendingCreditRequestsUseCase } from '../application/use-cases/list-pending-credit-requests.use-case';
import { GetCreditRequestUseCase } from '../application/use-cases/get-credit-request.use-case';
import { RejectCreditRequestUseCase } from '../application/use-cases/reject-credit-request.use-case';
import { ApproveCreditRequestUseCase } from '../application/use-cases/approve-credit-request.use-case';
import { CreateCreditRequestDto } from './dto/create-credit-request.dto';
import { ApproveCreditRequestDto } from './dto/approve-credit-request.dto';
import { RejectCreditRequestDto } from './dto/reject-credit-request.dto';

@ApiTags('credit-requests')
@ApiBearerAuth('access-token')
@Controller('credit-requests')
export class CreditRequestsController {
  constructor(
    private readonly createCreditRequestUseCase: CreateCreditRequestUseCase,
    private readonly listMyCreditRequestsUseCase: ListMyCreditRequestsUseCase,
    private readonly listPendingCreditRequestsUseCase: ListPendingCreditRequestsUseCase,
    private readonly getCreditRequestUseCase: GetCreditRequestUseCase,
    private readonly rejectCreditRequestUseCase: RejectCreditRequestUseCase,
    private readonly approveCreditRequestUseCase: ApproveCreditRequestUseCase,
  ) {}

  @Get('pending')
  @UseGuards(RolesGuard)
  @Roles(RoleName.ANALYST, RoleName.ADMIN)
  @ApiOperation({ summary: 'Bandeja: solicitudes pendientes (analista/admin)' })
  @ApiResponse({ status: 200 })
  async listPending() {
    return this.listPendingCreditRequestsUseCase.execute();
  }

  @Get('my')
  @UseGuards(RolesGuard)
  @Roles(RoleName.CLIENT)
  @ApiOperation({ summary: 'Mis solicitudes (cliente)' })
  async listMy(@CurrentUser() user: RequestUser) {
    return this.listMyCreditRequestsUseCase.execute(user.userId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(RoleName.CLIENT)
  @ApiOperation({ summary: 'Crear solicitud de préstamo' })
  @ApiResponse({ status: 409, description: 'Ya hay solicitud pendiente' })
  async create(
    @Body() dto: CreateCreditRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.createCreditRequestUseCase.execute({
      userId: user.userId,
      requestedAmount: dto.requestedAmount,
      termMonths: dto.termMonths,
      currency: dto.currency,
      purpose: dto.purpose ?? null,
      clientNotes: dto.clientNotes ?? null,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Detalle de solicitud (cliente dueño o analista/admin)',
  })
  async getById(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.getCreditRequestUseCase.execute(id, user.userId);
  }

  @Patch(':id/reject')
  @UseGuards(RolesGuard)
  @Roles(RoleName.ANALYST, RoleName.ADMIN)
  @ApiOperation({ summary: 'Rechazar solicitud' })
  async reject(
    @Param('id') id: string,
    @Body() dto: RejectCreditRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.rejectCreditRequestUseCase.execute({
      creditRequestId: id,
      analystUserId: user.userId,
      rejectionReason: dto.rejectionReason,
    });
  }

  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(RoleName.ANALYST, RoleName.ADMIN)
  @ApiOperation({
    summary: 'Aprobar: crea préstamo (ACTIVE) y cronograma de cuotas',
  })
  async approve(
    @Param('id') id: string,
    @Body() dto: ApproveCreditRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.approveCreditRequestUseCase.execute({
      creditRequestId: id,
      analystUserId: user.userId,
      approvedAmount: dto.approvedAmount,
      approvedTermMonths: dto.approvedTermMonths,
      approvedInterestRate: dto.approvedInterestRate,
      approvedInterestType: dto.approvedInterestType,
      firstInstallmentDueDate: dto.firstInstallmentDueDate
        ? new Date(dto.firstInstallmentDueDate)
        : undefined,
    });
  }
}
