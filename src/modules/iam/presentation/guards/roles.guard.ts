import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import type { RequestUser } from './jwt.strategy';
import type { IUserRoleRepository } from '../../domain/repositories/user-role.repository';
import type { IRoleRepository } from '../../domain/repositories/role.repository';
import { IAM_TOKENS } from '../../application/ports/tokens';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(IAM_TOKENS.USER_ROLE_REPOSITORY)
    private readonly userRoleRepo: IUserRoleRepository,
    @Inject(IAM_TOKENS.ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
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
    const roleNames: string[] = [];
    for (const ur of userRoles) {
      const role = await this.roleRepo.findById(ur.roleId);
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

