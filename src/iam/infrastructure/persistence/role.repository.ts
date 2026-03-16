import { Injectable } from '@nestjs/common';
import { Role } from '../../domain/entities/role.entity';
import { RoleRepositoryPort } from '../../application/ports/role.repository.port';

@Injectable()
export class RoleRepository implements RoleRepositoryPort {
  async findById(): Promise<Role | null> {
    return null;
  }

  async findAll(): Promise<Role[]> {
    return [];
  }

  async save(): Promise<void> {
    // Stub
  }
}
