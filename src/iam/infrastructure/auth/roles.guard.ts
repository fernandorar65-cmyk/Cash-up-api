import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { RequestUser } from './jwt.strategy';
import { ROLE_REPOSITORY } from '../../application/ports/role.repository.port';
import { USER_ROLE_REPOSITORY } from '../../application/ports/user-role.repository.port';
import type { RoleRepositoryPort } from '../../application/ports/role.repository.port';
import type { UserRoleRepositoryPort } from '../../application/ports/user-role.repository.port';
import { Inject } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(USER_ROLE_REPOSITORY)
    private readonly userRoleRepo: UserRoleRepositoryPort,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepo: RoleRepositoryPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as RequestUser | undefined;
    if (!user?.userId) {
      throw new ForbiddenException('No autorizado');
    }

    const userRoles = await this.userRoleRepo.findByUserId(user.userId);
    const roleIds = userRoles.map((ur) => ur.roleId);
    const roleNames: string[] = [];
    for (const roleId of roleIds) {
      const role = await this.roleRepo.findById(roleId);
      if (role) roleNames.push(role.name);
    }

    const hasRole = requiredRoles.some((r) => roleNames.includes(r));
    if (!hasRole) {
      throw new ForbiddenException(
        `Se requiere uno de los roles: ${requiredRoles.join(', ')}`,
      );
    }
    return true;
  }
}
