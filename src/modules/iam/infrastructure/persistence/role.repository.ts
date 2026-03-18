import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IRoleRepository } from '../../domain/repositories/role.repository';
import type { Role } from '../../domain/entities/role';
import { RoleOrmEntity } from './typeorm/entities/role.orm-entity';
import { toDomainRole, toOrmRole } from './mappers/iam-persistence.mapper';

@Injectable()
export class TypeOrmRoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(RoleOrmEntity)
    private readonly repo: Repository<RoleOrmEntity>,
  ) {}

  async findById(id: string): Promise<Role | null> {
    const e = await this.repo.findOne({ where: { id } });
    return e ? toDomainRole(e) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const e = await this.repo.findOne({ where: { name } });
    return e ? toDomainRole(e) : null;
  }

  async findAll(): Promise<Role[]> {
    const list = await this.repo.find({ order: { name: 'ASC' } });
    return list.map(toDomainRole);
  }

  async save(role: Role): Promise<void> {
    await this.repo.save(toOrmRole(role));
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}

