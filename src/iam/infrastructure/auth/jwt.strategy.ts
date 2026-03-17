import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { USER_REPOSITORY } from '../../application/ports/user.repository.port';
import type { UserRepositoryPort } from '../../application/ports/user.repository.port';
import { Inject } from '@nestjs/common';

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface RequestUser {
  userId: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
  ) {
    const secret = configService.get<string>('jwt.secret');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret ?? 'default-secret-change-in-production',
    });
  }

  async validate(payload: JwtPayload): Promise<RequestUser> {
    const user = await this.userRepo.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no válido o inactivo');
    }
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
