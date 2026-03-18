import { Controller, Get, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './modules/iam/presentation/guards/public.decorator';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Controller()
@UseFilters(HttpExceptionFilter)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('mensaje1')
  getMensaje1(): object {
    return {
      mensaje: 'Hola desde Azure Functions + NestJS',
      endpoint: 'GET /api/mensaje1',
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('mensaje2')
  getMensaje2(): object {
    return {
      mensaje: 'Segundo endpoint funcionando correctamente',
      endpoint: 'GET /api/mensaje2',
      timestamp: new Date().toISOString(),
    };
  }
}
