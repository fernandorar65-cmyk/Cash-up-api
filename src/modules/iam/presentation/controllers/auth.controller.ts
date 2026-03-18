import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { Public } from '../guards/public.decorator';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { RefreshAccessTokenUseCase } from '../../application/use-cases/refresh-access-token.use-case';
import { LoginHttpDto } from '../dtos/request/login.http.dto';
import { RegisterHttpDto } from '../dtos/request/register.http.dto';
import { RefreshAccessTokenHttpDto } from '../dtos/request/refresh-access-token.http.dto';
import { HttpExceptionFilter } from '../../../../common/filters/http-exception.filter';

@Controller('auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshAccessTokenUseCase: RefreshAccessTokenUseCase,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterHttpDto) {
    return this.registerUseCase.execute({
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginHttpDto) {
    return this.loginUseCase.execute({
      email: dto.email,
      password: dto.password,
    });
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() dto: RefreshAccessTokenHttpDto) {
    return this.refreshAccessTokenUseCase.execute({
      access_token: dto.access_token,
    });
  }
}

