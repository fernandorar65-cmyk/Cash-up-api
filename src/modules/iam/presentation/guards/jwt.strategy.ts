import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { IUserRepository } from '../../domain/repositories/user.repository';
import { IAM_TOKENS } from '../../application/ports/tokens';

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
    @Inject(IAM_TOKENS.USER_REPOSITORY) private readonly userRepo: IUserRepository,
  ) {
    const secret = configService.get<string>('jwt.secret');
    if (!secret) {
      throw new Error(
        'JWT secret no configurado. Define JWT_SECRET (config: jwt.secret).',
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
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

