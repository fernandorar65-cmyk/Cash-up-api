import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User } from './domain/entities/user.entity';
import { Role } from './domain/entities/role.entity';
import { UserRole } from './domain/entities/user-role.entity';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { RoleRepository } from './infrastructure/persistence/role.repository';
import { UserRoleRepository } from './infrastructure/persistence/user-role.repository';
import {
  USER_REPOSITORY,
  ROLE_REPOSITORY,
  USER_ROLE_REPOSITORY,
} from './application/ports';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { GetRoleUseCase } from './application/use-cases/get-role.use-case';
import { ListRolesUseCase } from './application/use-cases/list-roles.use-case';
import { GetUserRolesUseCase } from './application/use-cases/get-user-roles.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { UsersController } from './presentation/users.controller';
import { RolesController } from './presentation/roles.controller';
import { AuthController } from './presentation/auth.controller';
import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
import { JwtAuthGuard } from './infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from './infrastructure/auth/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, UserRole]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const expiresIn = config.get<string>('jwt.expiresIn') ?? '1h';
        const seconds = expiresIn === '1h' ? 3600 : parseInt(expiresIn, 10) || 3600;
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
    { provide: USER_REPOSITORY, useClass: UserRepository },
    { provide: ROLE_REPOSITORY, useClass: RoleRepository },
    { provide: USER_ROLE_REPOSITORY, useClass: UserRoleRepository },
    GetUserUseCase,
    GetRoleUseCase,
    ListRolesUseCase,
    GetUserRolesUseCase,
    RegisterUseCase,
    LoginUseCase,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [
    USER_REPOSITORY,
    ROLE_REPOSITORY,
    USER_ROLE_REPOSITORY,
    JwtModule,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class IamModule {}
