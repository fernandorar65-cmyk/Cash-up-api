import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { USER_REPOSITORY } from '../ports/user.repository.port';
import type { UserRepositoryPort } from '../ports/user.repository.port';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    }
    return user;
  }
}
