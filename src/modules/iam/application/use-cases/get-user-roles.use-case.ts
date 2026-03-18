import { Inject, Injectable } from '@nestjs/common';
import type { IUserRoleRepository } from '../../domain/repositories/user-role.repository';
import { IAM_TOKENS } from '../ports/tokens';

export interface UserRoleResponse {
  id: string;
  userId: string;
  roleId: string;
  assignedAt: Date;
}

@Injectable()
export class GetUserRolesUseCase {
  constructor(
    @Inject(IAM_TOKENS.USER_ROLE_REPOSITORY)
    private readonly userRoleRepo: IUserRoleRepository,
  ) {}

  async execute(userId: string): Promise<UserRoleResponse[]> {
    const list = await this.userRoleRepo.findByUserId(userId);
    return list.map((ur) => ({
      id: ur.id,
      userId: ur.userId,
      roleId: ur.roleId,
      assignedAt: ur.assignedAt,
    }));
  }
}

