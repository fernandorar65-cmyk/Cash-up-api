import {
  Inject,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/entities/user-role.entity';
import { RoleName } from '../../domain/enums/role-name.enum';
import type { RegisterInput, RegisterResult } from '../dto/register.dto';
import { USER_REPOSITORY } from '../ports/user.repository.port';
import { ROLE_REPOSITORY } from '../ports/role.repository.port';
import { USER_ROLE_REPOSITORY } from '../ports/user-role.repository.port';
import type { UserRepositoryPort } from '../ports/user.repository.port';
import type { RoleRepositoryPort } from '../ports/role.repository.port';
import type { UserRoleRepositoryPort } from '../ports/user-role.repository.port';
import { PASSWORD_HASHER } from '../ports/password-hasher.port';
import type { PasswordHasherPort } from '../ports/password-hasher.port';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    @Inject(ROLE_REPOSITORY) private readonly roleRepo: RoleRepositoryPort,
    @Inject(USER_ROLE_REPOSITORY) private readonly userRoleRepo: UserRoleRepositoryPort,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(input: RegisterInput): Promise<RegisterResult> {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('Ya existe un usuario con ese email');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = new User();
    user.email = input.email;
    user.name = input.name;
    user.passwordHash = passwordHash;
    user.isActive = true;
    await this.userRepo.save(user);

    const clientRole = await this.roleRepo.findByName(RoleName.CLIENT);
    if (clientRole) {
      const userRole = new UserRole();
      userRole.userId = user.id;
      userRole.roleId = clientRole.id;
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
