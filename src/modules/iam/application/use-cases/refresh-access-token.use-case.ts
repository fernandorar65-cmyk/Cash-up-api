import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { IUserRepository } from '../../domain/repositories/user.repository';
import { IAM_TOKENS } from '../ports/tokens';

type AccessPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class RefreshAccessTokenUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(IAM_TOKENS.USER_REPOSITORY) private readonly userRepo: IUserRepository,
  ) {}

  async execute(input: { access_token: string }): Promise<{ access_token: string }> {
    const secret =
      this.configService.get<string>('jwt.secret') ??
      'default-secret-change-in-production';

    let payload: AccessPayload;
    try {
      payload = await this.jwtService.verifyAsync<AccessPayload>(input.access_token, {
        secret,
        ignoreExpiration: true,
      });
    } catch {
      throw new UnauthorizedException('Token inválido');
    }

    const user = await this.userRepo.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no válido o inactivo');
    }

    const access_token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { access_token };
  }
}

