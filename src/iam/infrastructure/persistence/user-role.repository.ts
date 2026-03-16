import { Injectable } from '@nestjs/common';
import { UserRole } from '../../domain/entities/user-role.entity';
import { UserRoleRepositoryPort } from '../../application/ports/user-role.repository.port';

@Injectable()
export class UserRoleRepository implements UserRoleRepositoryPort {
  async findByUserId(): Promise<UserRole[]> {
    return [];
  }

  async save(): Promise<void> {
    // Stub
  }

  async deleteByUserIdAndRoleId(): Promise<void> {
    // Stub
  }
}
