import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { User } from '../../domain/entities/user';
import { UserRole } from '../../domain/entities/user-role';
import { RoleName } from '../../domain/enums/role-name.enum';
import type { IUserRepository } from '../../domain/repositories/user.repository';
import type { IRoleRepository } from '../../domain/repositories/role.repository';
import type { IUserRoleRepository } from '../../domain/repositories/user-role.repository';
import type { PasswordHasherPort } from '../ports/password-hasher.port';
import { IAM_TOKENS } from '../ports/tokens';
import { guid } from '../../../../common/guid';
import { DataSource } from 'typeorm';
import { UserOrmEntity } from '../../infrastructure/persistence/typeorm/entities/user.orm-entity';
import { RoleOrmEntity } from '../../infrastructure/persistence/typeorm/entities/role.orm-entity';
import { UserRoleOrmEntity } from '../../infrastructure/persistence/typeorm/entities/user-role.orm-entity';

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
    private readonly dataSource: DataSource,
  ) {}

  async execute(input: CreateAnalystCommand): Promise<CreateAnalystResponse> {
    return await this.dataSource.transaction(async (manager) => {
      const userOrmRepo = manager.getRepository(UserOrmEntity);
      const roleOrmRepo = manager.getRepository(RoleOrmEntity);
      const userRoleOrmRepo = manager.getRepository(UserRoleOrmEntity);

      const existing = await userOrmRepo.findOne({
        where: { email: input.email },
      });
      if (existing) {
        throw new ConflictException('Ya existe un usuario con ese email');
      }

      const analystRole = await roleOrmRepo.findOne({
        where: { name: RoleName.ANALYST },
      });
      if (!analystRole) {
        throw new ConflictException(
          `Rol "${RoleName.ANALYST}" no existe en el sistema`,
        );
      }

      const passwordHash = await this.passwordHasher.hash(input.password);
      const user = new User({
        id: guid(),
        email: input.email,
        name: input.name,
        passwordHash,
        isActive: true,
      });

      const userOrm = new UserOrmEntity();
      userOrm.id = user.id;
      userOrm.email = user.email;
      userOrm.name = user.name;
      userOrm.passwordHash = user.passwordHash;
      userOrm.isActive = user.isActive;
      await userOrmRepo.save(userOrm);

      const userRole = new UserRole({
        id: guid(),
        userId: user.id,
        roleId: analystRole.id,
        assignedAt: new Date(),
      });

      const userRoleOrm = new UserRoleOrmEntity();
      userRoleOrm.id = userRole.id;
      userRoleOrm.userId = userRole.userId;
      userRoleOrm.roleId = userRole.roleId;
      userRoleOrm.assignedAt = userRole.assignedAt;
      await userRoleOrmRepo.save(userRoleOrm);

      return { id: user.id, email: user.email, name: user.name };
    });
  }
}

