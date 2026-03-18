import { Inject, Injectable } from '@nestjs/common';
import type { IRoleRepository } from '../../domain/repositories/role.repository';
import { IAM_TOKENS } from '../ports/tokens';
import type { RoleResponse } from './get-role.use-case';

@Injectable()
export class ListRolesUseCase {
  constructor(
    @Inject(IAM_TOKENS.ROLE_REPOSITORY) private readonly roleRepo: IRoleRepository,
  ) {}

  async execute(): Promise<RoleResponse[]> {
    const list = await this.roleRepo.findAll();
    return list.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }
}

