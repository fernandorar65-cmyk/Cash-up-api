import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser } from './jwt.strategy';

/**
 * Inyecta el usuario autenticado (request.user) en el handler.
 * Requiere JwtAuthGuard. Uso: @CurrentUser() user: RequestUser
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as RequestUser;
  },
);
