import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { RoleName } from '../../../iam/domain/enums/role-name.enum';
import { CurrentUser } from '../../../iam/presentation/guards/current-user.decorator';
import type { RequestUser } from '../../../iam/presentation/guards/jwt.strategy';
import { RolesGuard } from '../../../iam/presentation/guards/roles.guard';
import { Roles } from '../../../iam/presentation/guards/roles.decorator';

import { CreateCreditRequestUseCase } from '../../application/use-cases/create-credit-request.use-case';
import { ListMyCreditRequestsUseCase } from '../../application/use-cases/list-my-credit-requests.use-case';
import { ListPendingCreditRequestsUseCase } from '../../application/use-cases/list-pending-credit-requests.use-case';
import { GetCreditRequestUseCase } from '../../application/use-cases/get-credit-request.use-case';
import { RejectCreditRequestUseCase } from '../../application/use-cases/reject-credit-request.use-case';
import { ApproveCreditRequestUseCase } from '../../application/use-cases/approve-credit-request.use-case';
import { ListCreditRequestsUseCase } from '../../application/use-cases/list-credit-requests.use-case';
import { CancelCreditRequestUseCase } from '../../application/use-cases/cancel-credit-request.use-case';
import { MarkCreditRequestUnderReviewUseCase } from '../../application/use-cases/mark-credit-request-under-review.use-case';

import { CreateCreditRequestHttpDto } from '../dtos/request/create-credit-request.http.dto';
import { ApproveCreditRequestHttpDto } from '../dtos/request/approve-credit-request.http.dto';
import { RejectCreditRequestHttpDto } from '../dtos/request/reject-credit-request.http.dto';
import { CreditRequestStatus } from '../../domain/enums/credit-request-status.enum';

@ApiTags('credit-requests')
@ApiBearerAuth('access-token')
@Controller('credit-requests')
export class CreditRequestsController {
  constructor(
    private readonly createCreditRequestUseCase: CreateCreditRequestUseCase,
    private readonly listMyCreditRequestsUseCase: ListMyCreditRequestsUseCase,
    private readonly listPendingCreditRequestsUseCase: ListPendingCreditRequestsUseCase,
    private readonly listCreditRequestsUseCase: ListCreditRequestsUseCase,
    private readonly getCreditRequestUseCase: GetCreditRequestUseCase,
    private readonly rejectCreditRequestUseCase: RejectCreditRequestUseCase,
    private readonly approveCreditRequestUseCase: ApproveCreditRequestUseCase,
    private readonly cancelCreditRequestUseCase: CancelCreditRequestUseCase,
    private readonly markCreditRequestUnderReviewUseCase: MarkCreditRequestUnderReviewUseCase,
  ) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(RoleName.ANALYST, RoleName.ADMIN)
  @ApiOperation({ summary: 'Listar solicitudes con filtros (staff)' })
  async list(
    @Query('clientId') clientId?: string,
    @Query('status') status?: CreditRequestStatus,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.listCreditRequestsUseCase.execute({
      clientId,
      status,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
  }

  @Get('pending')
  @UseGuards(RolesGuard)
  @Roles(RoleName.ANALYST, RoleName.ADMIN)
  @ApiOperation({ summary: 'Bandeja: solicitudes pendientes (analista/admin)' })
  @ApiResponse({ status: 200 })
  async listPending() {
    return this.listPendingCreditRequestsUseCase.execute();
  }

  @Get('pending-approval')
  @UseGuards(RolesGuard)
  @Roles(RoleName.ANALYST, RoleName.ADMIN)
  @ApiOperation({
    summary: 'Pendientes de aprobar (analista/admin)',
    description:
      'Alias de bandeja para analistas: devuelve solicitudes PENDING y UNDER_REVIEW.',
  })
  @ApiResponse({ status: 200 })
  async listPendingApproval() {
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
    @Body() dto: CreateCreditRequestHttpDto,
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
    @Body() dto: RejectCreditRequestHttpDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.rejectCreditRequestUseCase.execute({
      creditRequestId: id,
      analystUserId: user.userId,
      rejectionReason: dto.rejectionReason,
    });
  }

  @Patch(':id/cancel')
  @UseGuards(RolesGuard)
  @Roles(RoleName.CLIENT)
  @ApiOperation({ summary: 'Cancelar solicitud (cliente)' })
  async cancel(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.cancelCreditRequestUseCase.execute({
      creditRequestId: id,
      requesterUserId: user.userId,
    });
  }

  @Patch(':id/under-review')
  @UseGuards(RolesGuard)
  @Roles(RoleName.ANALYST, RoleName.ADMIN)
  @ApiOperation({ summary: 'Marcar solicitud en revisión (staff)' })
  async underReview(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.markCreditRequestUnderReviewUseCase.execute({
      creditRequestId: id,
      reviewerUserId: user.userId,
    });
  }

  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(RoleName.ANALYST, RoleName.ADMIN)
  @ApiOperation({summary: 'Aprobar: crea préstamo (ACTIVE) y cronograma de cuotas',})
  async approve(@Param('id') id: string,@Body() dto: ApproveCreditRequestHttpDto,@CurrentUser() user: RequestUser) {
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

