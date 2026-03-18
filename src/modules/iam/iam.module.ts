import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { IAM_TOKENS } from './application/ports/tokens';
import { TypeOrmUserRepository } from './infrastructure/persistence/user.repository';
import { TypeOrmRoleRepository } from './infrastructure/persistence/role.repository';
import { TypeOrmUserRoleRepository } from './infrastructure/persistence/user-role.repository';
import { BcryptPasswordHasher } from './infrastructure/external/crypto/bcrypt-password-hasher';

import { UserOrmEntity } from './infrastructure/persistence/typeorm/entities/user.orm-entity';
import { RoleOrmEntity } from './infrastructure/persistence/typeorm/entities/role.orm-entity';
import { UserRoleOrmEntity } from './infrastructure/persistence/typeorm/entities/user-role.orm-entity';

import { AuthController } from './presentation/controllers/auth.controller';
import { UsersController } from './presentation/controllers/users.controller';
import { RolesController } from './presentation/controllers/roles.controller';

import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { CreateAnalystUseCase } from './application/use-cases/create-analyst.use-case';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { GetUserRolesUseCase } from './application/use-cases/get-user-roles.use-case';
import { GetRoleUseCase } from './application/use-cases/get-role.use-case';
import { ListRolesUseCase } from './application/use-cases/list-roles.use-case';

// Reutilizamos tu estrategia/guards actuales (aún viven en src/iam/...)
import { JwtStrategy } from './presentation/guards/jwt.strategy';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { RolesGuard } from './presentation/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity, RoleOrmEntity, UserRoleOrmEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const expiresIn = config.get<string>('jwt.expiresIn') ?? '1h';
        const seconds =
          expiresIn === '1h' ? 3600 : parseInt(expiresIn, 10) || 3600;
        return {
          secret: config.get<string>('jwt.secret') ?? 'default-secret',
          signOptions: { expiresIn: seconds },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, UsersController, RolesController],
  providers: [
    { provide: IAM_TOKENS.USER_REPOSITORY, useClass: TypeOrmUserRepository },
    { provide: IAM_TOKENS.ROLE_REPOSITORY, useClass: TypeOrmRoleRepository },
    {
      provide: IAM_TOKENS.USER_ROLE_REPOSITORY,
      useClass: TypeOrmUserRoleRepository,
    },
    { provide: IAM_TOKENS.PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    RegisterUseCase,
    LoginUseCase,
    CreateAnalystUseCase,
    GetUserUseCase,
    GetUserRolesUseCase,
    GetRoleUseCase,
    ListRolesUseCase,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [
    JwtModule,
    JwtAuthGuard,
    RolesGuard,
    IAM_TOKENS.USER_REPOSITORY,
    IAM_TOKENS.ROLE_REPOSITORY,
    IAM_TOKENS.USER_ROLE_REPOSITORY,
    IAM_TOKENS.PASSWORD_HASHER,
  ],
})
export class IamModule {}

