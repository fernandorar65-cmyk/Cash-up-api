import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoleName } from '../domain/enums/role-name.enum';
import { GetUserUseCase } from '../application/use-cases/get-user.use-case';
import { GetUserRolesUseCase } from '../application/use-cases/get-user-roles.use-case';
import { CreateAnalystUseCase } from '../application/use-cases/create-analyst.use-case';
import { CreateAnalystDto } from './resource/request/create-analyst.dto';
import { RolesGuard } from '../infrastructure/auth/roles.guard';
import { Roles } from '../infrastructure/auth/roles.decorator';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(RolesGuard)
@Roles(RoleName.ADMIN, RoleName.ANALYST)
export class UsersController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly getUserRolesUseCase: GetUserRolesUseCase,
    private readonly createAnalystUseCase: CreateAnalystUseCase,
  ) {}

  @Post('analysts')
  @Roles(RoleName.ADMIN)
  @ApiOperation({ summary: 'Crear analista (solo admin)', description: 'Crea un usuario con rol analista. Solo el admin puede usar este endpoint.' })
  @ApiResponse({ status: 201, description: 'Analista creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Ya existe un usuario con ese email' })
  async createAnalyst(@Body() dto: CreateAnalystDto) {
    return this.createAnalystUseCase.execute({
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getById(@Param('id') id: string) {
    return this.getUserUseCase.execute(id);
  }

  @Get(':id/roles')
  @ApiOperation({ summary: 'Obtener roles del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de asignaciones usuario-rol' })
  async getRoles(@Param('id') id: string) {
    return this.getUserRolesUseCase.execute(id);
  }
}
