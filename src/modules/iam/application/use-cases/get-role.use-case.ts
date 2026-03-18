import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IRoleRepository } from '../../domain/repositories/role.repository';
import { IAM_TOKENS } from '../ports/tokens';

export interface RoleResponse {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class GetRoleUseCase {
  constructor(
    @Inject(IAM_TOKENS.ROLE_REPOSITORY) private readonly roleRepo: IRoleRepository,
  ) {}

  async execute(roleId: string): Promise<RoleResponse> {
    const role = await this.roleRepo.findById(roleId);
    if (!role) throw new NotFoundException(`Rol con id ${roleId} no encontrado`);
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
}

