import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CLIENT_REPOSITORY } from '../../../risk-scoring/application/ports/client.repository.port';
import type { ClientRepositoryPort } from '../../../risk-scoring/application/ports/client.repository.port';
import { USER_ROLE_REPOSITORY } from '../../../iam/application/ports/user-role.repository.port';
import type { UserRoleRepositoryPort } from '../../../iam/application/ports/user-role.repository.port';
import { ROLE_REPOSITORY } from '../../../iam/application/ports/role.repository.port';
import type { RoleRepositoryPort } from '../../../iam/application/ports/role.repository.port';
import { CREDIT_REQUEST_REPOSITORY } from '../ports/credit-request.repository.port';
import type { CreditRequestRepositoryPort } from '../ports/credit-request.repository.port';
import { RoleName } from '../../../iam/domain/enums/role-name.enum';

@Injectable()
export class GetCreditRequestUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY) private readonly clientRepo: ClientRepositoryPort,
    @Inject(USER_ROLE_REPOSITORY)
    private readonly userRoleRepo: UserRoleRepositoryPort,
    @Inject(ROLE_REPOSITORY) private readonly roleRepo: RoleRepositoryPort,
    @Inject(CREDIT_REQUEST_REPOSITORY)
    private readonly creditRequestRepo: CreditRequestRepositoryPort,
  ) {}

  private async roleNamesForUser(userId: string): Promise<string[]> {
    const urs = await this.userRoleRepo.findByUserId(userId);
    const names: string[] = [];
    for (const ur of urs) {
      const r = await this.roleRepo.findById(ur.roleId);
      if (r) names.push(r.name);
    }
    return names;
  }

  async execute(creditRequestId: string, viewerUserId: string) {
    const req = await this.creditRequestRepo.findById(creditRequestId);
    if (!req) {
      throw new NotFoundException('Solicitud no encontrada.');
    }

    const roles = await this.roleNamesForUser(viewerUserId);
    const isStaff =
      roles.includes(RoleName.ANALYST) || roles.includes(RoleName.ADMIN);

    if (!isStaff) {
      const client = await this.clientRepo.findByUserId(viewerUserId);
      if (!client || client.id !== req.clientId) {
        throw new ForbiddenException('No puedes ver esta solicitud.');
      }
    }

    return {
      id: req.id,
      clientId: req.clientId,
      requestedAmount: Number(req.requestedAmount),
      termMonths: req.termMonths,
      currency: req.currency,
      purpose: req.purpose,
      clientNotes: req.clientNotes,
      evaluationId: req.evaluationId,
      status: req.status,
      reviewedByUserId: req.reviewedByUserId,
      reviewedAt: req.reviewedAt,
      rejectionReason: req.rejectionReason,
      approvedAmount: req.approvedAmount != null ? Number(req.approvedAmount) : null,
      approvedTermMonths: req.approvedTermMonths,
      approvedInterestRate:
        req.approvedInterestRate != null
          ? Number(req.approvedInterestRate)
          : null,
      approvedInterestType: req.approvedInterestType,
      loanId: req.loanId,
      createdAt: req.createdAt,
      updatedAt: req.updatedAt,
    };
  }
}
