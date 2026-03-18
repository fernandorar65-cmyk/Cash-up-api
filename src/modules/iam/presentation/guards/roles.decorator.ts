import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Restringe el acceso a usuarios que tengan al menos uno de los roles indicados.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

