import {
  Inject,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/entities/user-role.entity';
import { USER_REPOSITORY } from '../ports/user.repository.port';
import { ROLE_REPOSITORY } from '../ports/role.repository.port';
import { USER_ROLE_REPOSITORY } from '../ports/user-role.repository.port';
import type { UserRepositoryPort } from '../ports/user.repository.port';
import type { RoleRepositoryPort } from '../ports/role.repository.port';
import type { UserRoleRepositoryPort } from '../ports/user-role.repository.port';

export interface RegisterInput {
  email: string;
  name: string;
  password: string;
}

export interface RegisterResult {
  id: string;
  email: string;
  name: string;
}

@Injectable()
export class RegisterUseCase {
  private readonly defaultRoleName = 'analyst';

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    @Inject(ROLE_REPOSITORY) private readonly roleRepo: RoleRepositoryPort,
    @Inject(USER_ROLE_REPOSITORY) private readonly userRoleRepo: UserRoleRepositoryPort,
  ) {}

  async execute(input: RegisterInput): Promise<RegisterResult> {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('Ya existe un usuario con ese email');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = new User();
    user.email = input.email;
    user.name = input.name;
    user.passwordHash = passwordHash;
    user.isActive = true;
    await this.userRepo.save(user);

    const defaultRole = await this.roleRepo.findAll().then((roles) =>
      roles.find((r) => r.name === this.defaultRoleName),
    );
    if (defaultRole) {
      const userRole = new UserRole();
      userRole.userId = user.id;
      userRole.roleId = defaultRole.id;
      userRole.assignedAt = new Date();
      await this.userRoleRepo.save(userRole);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
