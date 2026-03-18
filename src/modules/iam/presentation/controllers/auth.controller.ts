import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { Public } from '../guards/public.decorator';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { LoginHttpDto } from '../dtos/request/login.http.dto';
import { RegisterHttpDto } from '../dtos/request/register.http.dto';
import { HttpExceptionFilter } from '../../../../common/filters/http-exception.filter';

@Controller('auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
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
}

