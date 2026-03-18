import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CLIENT_REPOSITORY } from '../ports/client.repository.port';
import type { ClientRepositoryPort } from '../ports/client.repository.port';
import { CREDIT_EVALUATION_REPOSITORY } from '../ports/credit-evaluation.repository.port';
import type { CreditEvaluationRepositoryPort } from '../ports/credit-evaluation.repository.port';

import { IAM_TOKENS } from '../../../iam/application/ports/tokens';
import type { IUserRoleRepository } from '../../../iam/domain/repositories/user-role.repository';
import type { IRoleRepository } from '../../../iam/domain/repositories/role.repository';
import { RoleName } from '../../../iam/domain/enums/role-name.enum';

@Injectable()
export class ListClientEvaluationsUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY) private readonly clientRepo: ClientRepositoryPort,
    @Inject(CREDIT_EVALUATION_REPOSITORY)
    private readonly evaluationRepo: CreditEvaluationRepositoryPort,
    @Inject(IAM_TOKENS.USER_ROLE_REPOSITORY)
    private readonly userRoleRepo: IUserRoleRepository,
    @Inject(IAM_TOKENS.ROLE_REPOSITORY) private readonly roleRepo: IRoleRepository,
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

  async execute(clientId: string, viewerUserId: string) {
    const client = await this.clientRepo.findById(clientId);
    if (!client) {
      throw new NotFoundException('Cliente no encontrado.');
    }

    const roles = await this.roleNamesForUser(viewerUserId);
    const isStaff =
      roles.includes(RoleName.ANALYST) || roles.includes(RoleName.ADMIN);

    if (!isStaff) {
      if (!client.userId || client.userId !== viewerUserId) {
        throw new ForbiddenException('No puedes ver las evaluaciones de este cliente.');
      }
    }

    return this.evaluationRepo.findByClientId(clientId);
  }
}

