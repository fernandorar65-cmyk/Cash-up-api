import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { User } from '../../domain/entities/user';
import { UserRole } from '../../domain/entities/user-role';
import { RoleName } from '../../domain/enums/role-name.enum';
import type { IUserRepository } from '../../domain/repositories/user.repository';
import type { IRoleRepository } from '../../domain/repositories/role.repository';
import type { IUserRoleRepository } from '../../domain/repositories/user-role.repository';
import type { PasswordHasherPort } from '../ports/password-hasher.port';
import { IAM_TOKENS } from '../ports/tokens';

export interface CreateAnalystCommand {
  email: string;
  name: string;
  password: string;
}

export interface CreateAnalystResponse {
  id: string;
  email: string;
  name: string;
}

@Injectable()
export class CreateAnalystUseCase {
  constructor(
    @Inject(IAM_TOKENS.USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(IAM_TOKENS.ROLE_REPOSITORY) private readonly roleRepo: IRoleRepository,
    @Inject(IAM_TOKENS.USER_ROLE_REPOSITORY)
    private readonly userRoleRepo: IUserRoleRepository,
    @Inject(IAM_TOKENS.PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(input: CreateAnalystCommand): Promise<CreateAnalystResponse> {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('Ya existe un usuario con ese email');
    }

    const analystRole = await this.roleRepo.findByName(RoleName.ANALYST);
    if (!analystRole) {
      throw new ConflictException(`Rol "${RoleName.ANALYST}" no existe en el sistema`);
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = new User({
      email: input.email,
      name: input.name,
      passwordHash,
      isActive: true,
    });
    await this.userRepo.save(user);

    const userRole = new UserRole({
      userId: user.id,
      roleId: analystRole.id,
      assignedAt: new Date(),
    });
    await this.userRoleRepo.save(userRole);

    return { id: user.id, email: user.email, name: user.name };
  }
}

