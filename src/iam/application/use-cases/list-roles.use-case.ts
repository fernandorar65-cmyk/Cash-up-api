import { Inject, Injectable } from '@nestjs/common';
import { Role } from '../../domain/entities/role.entity';
import { ROLE_REPOSITORY } from '../ports/role.repository.port';
import type { RoleRepositoryPort } from '../ports/role.repository.port';

@Injectable()
export class ListRolesUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepo: RoleRepositoryPort,
  ) {}

  async execute(): Promise<Role[]> {
    return this.roleRepo.findAll();
  }
}
