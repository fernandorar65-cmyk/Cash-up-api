import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../domain/entities/user-role.entity';
import type { UserRoleRepositoryPort } from '../../application/ports/user-role.repository.port';

@Injectable()
export class UserRoleRepository implements UserRoleRepositoryPort {
  constructor(
    @InjectRepository(UserRole)
    private readonly repo: Repository<UserRole>,
  ) {}

  async findByUserId(userId: string): Promise<UserRole[]> {
    return this.repo.find({
      where: { userId },
      order: { assignedAt: 'DESC' },
    });
  }

  async save(userRole: UserRole): Promise<void> {
    await this.repo.save(userRole);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async deleteByUserIdAndRoleId(userId: string, roleId: string): Promise<void> {
    await this.repo.delete({ userId, roleId });
  }
}
