import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Restringe el acceso a usuarios que tengan al menos uno de los roles indicados.
 * Debe usarse junto con JwtAuthGuard y RolesGuard.
 * @example @Roles('admin', 'analyst')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
