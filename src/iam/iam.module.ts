import { Module } from '@nestjs/common';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { RoleRepository } from './infrastructure/persistence/role.repository';
import { UserRoleRepository } from './infrastructure/persistence/user-role.repository';
import {
  USER_REPOSITORY,
  ROLE_REPOSITORY,
  USER_ROLE_REPOSITORY,
} from './application/ports';

@Module({
  providers: [
    { provide: USER_REPOSITORY, useClass: UserRepository },
    { provide: ROLE_REPOSITORY, useClass: RoleRepository },
    { provide: USER_ROLE_REPOSITORY, useClass: UserRoleRepository },
  ],
  exports: [USER_REPOSITORY, ROLE_REPOSITORY, USER_ROLE_REPOSITORY],
})
export class IamModule {}
