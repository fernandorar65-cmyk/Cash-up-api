import { Inject, Injectable } from '@nestjs/common';
import { UserRole } from '../../domain/entities/user-role.entity';
import { USER_ROLE_REPOSITORY } from '../ports/user-role.repository.port';
import type { UserRoleRepositoryPort } from '../ports/user-role.repository.port';

@Injectable()
export class GetUserRolesUseCase {
  constructor(
    @Inject(USER_ROLE_REPOSITORY)
    private readonly userRoleRepo: UserRoleRepositoryPort,
  ) {}

  async execute(userId: string): Promise<UserRole[]> {
    return this.userRoleRepo.findByUserId(userId);
  }
}
