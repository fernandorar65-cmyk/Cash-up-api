import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../domain/entities/role.entity';
import type { RoleRepositoryPort } from '../../application/ports/role.repository.port';

@Injectable()
export class RoleRepository implements RoleRepositoryPort {
  constructor(
    @InjectRepository(Role)
    private readonly repo: Repository<Role>,
  ) {}

  async findById(id: string): Promise<Role | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Role | null> {
    return this.repo.findOne({ where: { name } });
  }

  async findAll(): Promise<Role[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async save(role: Role): Promise<void> {
    await this.repo.save(role);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
