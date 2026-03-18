import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IUserRoleRepository } from '../../domain/repositories/user-role.repository';
import type { UserRole } from '../../domain/entities/user-role';
import { UserRoleOrmEntity } from './typeorm/entities/user-role.orm-entity';
import { toDomainUserRole, toOrmUserRole } from './mappers/iam-persistence.mapper';

@Injectable()
export class TypeOrmUserRoleRepository implements IUserRoleRepository {
  constructor(
    @InjectRepository(UserRoleOrmEntity)
    private readonly repo: Repository<UserRoleOrmEntity>,
  ) {}

  async findByUserId(userId: string): Promise<UserRole[]> {
    const list = await this.repo.find({
      where: { userId },
      order: { assignedAt: 'DESC' },
    });
    return list.map(toDomainUserRole);
  }

  async save(userRole: UserRole): Promise<void> {
    await this.repo.save(toOrmUserRole(userRole));
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async deleteByUserIdAndRoleId(userId: string, roleId: string): Promise<void> {
    await this.repo.delete({ userId, roleId });
  }
}

