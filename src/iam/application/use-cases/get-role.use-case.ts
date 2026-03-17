import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../../domain/entities/role.entity';
import { ROLE_REPOSITORY } from '../ports/role.repository.port';
import type { RoleRepositoryPort } from '../ports/role.repository.port';

@Injectable()
export class GetRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepo: RoleRepositoryPort,
  ) {}

  async execute(roleId: string): Promise<Role> {
    const role = await this.roleRepo.findById(roleId);
    if (!role) {
      throw new NotFoundException(`Rol con id ${roleId} no encontrado`);
    }
    return role;
  }
}
