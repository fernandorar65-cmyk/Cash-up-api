import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { Role } from './domain/entities/role.entity';
import { UserRole } from './domain/entities/user-role.entity';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { RoleRepository } from './infrastructure/persistence/role.repository';
import { UserRoleRepository } from './infrastructure/persistence/user-role.repository';
import {
  USER_REPOSITORY,
  ROLE_REPOSITORY,
  USER_ROLE_REPOSITORY,
} from './application/ports';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { GetRoleUseCase } from './application/use-cases/get-role.use-case';
import { ListRolesUseCase } from './application/use-cases/list-roles.use-case';
import { GetUserRolesUseCase } from './application/use-cases/get-user-roles.use-case';
import { UsersController } from './presentation/users.controller';
import { RolesController } from './presentation/roles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, UserRole])],
  controllers: [UsersController, RolesController],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserRepository },
    { provide: ROLE_REPOSITORY, useClass: RoleRepository },
    { provide: USER_ROLE_REPOSITORY, useClass: UserRoleRepository },
    GetUserUseCase,
    GetRoleUseCase,
    ListRolesUseCase,
    GetUserRolesUseCase,
  ],
  exports: [USER_REPOSITORY, ROLE_REPOSITORY, USER_ROLE_REPOSITORY],
})
export class IamModule {}
