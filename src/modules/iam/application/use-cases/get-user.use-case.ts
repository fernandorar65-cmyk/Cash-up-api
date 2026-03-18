import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository';
import { IAM_TOKENS } from '../ports/tokens';

export interface GetUserResponse {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(IAM_TOKENS.USER_REPOSITORY) private readonly userRepo: IUserRepository,
  ) {}

  async execute(userId: string): Promise<GetUserResponse> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

