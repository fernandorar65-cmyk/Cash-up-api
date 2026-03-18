import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IUserRepository } from '../../domain/repositories/user.repository';
import type { User } from '../../domain/entities/user';
import { UserOrmEntity } from './typeorm/entities/user.orm-entity';
import { toDomainUser, toOrmUser } from './mappers/iam-persistence.mapper';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const e = await this.repo.findOne({ where: { id } });
    return e ? toDomainUser(e) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const e = await this.repo.findOne({ where: { email } });
    return e ? toDomainUser(e) : null;
  }

  async save(user: User): Promise<void> {
    await this.repo.save(toOrmUser(user));
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}

