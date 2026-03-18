import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { IUserRepository } from '../../domain/repositories/user.repository';
import type { IUserRoleRepository } from '../../domain/repositories/user-role.repository';
import type { IRoleRepository } from '../../domain/repositories/role.repository';
import type { PasswordHasherPort } from '../ports/password-hasher.port';
import { IAM_TOKENS } from '../ports/tokens';
import type { LoginCommand, LoginResponse } from '../dtos/auth/login.dto';
import { RoleName } from '../../domain/enums/role-name.enum';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IAM_TOKENS.USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(IAM_TOKENS.USER_ROLE_REPOSITORY)
    private readonly userRoleRepo: IUserRoleRepository,
    @Inject(IAM_TOKENS.ROLE_REPOSITORY) private readonly roleRepo: IRoleRepository,
    private readonly jwtService: JwtService,
    @Inject(IAM_TOKENS.PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  private async roleNamesForUser(userId: string): Promise<string[]> {
    const urs = await this.userRoleRepo.findByUserId(userId);
    const names: string[] = [];
    for (const ur of urs) {
      const r = await this.roleRepo.findById(ur.roleId);
      if (r) names.push(r.name);
    }
    return names;
  }

  private pickPrimaryRole(roles: string[]): string | null {
    if (roles.includes(RoleName.ADMIN)) return RoleName.ADMIN;
    if (roles.includes(RoleName.ANALYST)) return RoleName.ANALYST;
    if (roles.includes(RoleName.CLIENT)) return RoleName.CLIENT;
    return roles[0] ?? null;
  }

  async execute(input: LoginCommand): Promise<LoginResponse> {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await this.passwordHasher.compare(
      input.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const roles = await this.roleNamesForUser(user.id);
    const role = this.pickPrimaryRole(roles);

    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      role,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}

