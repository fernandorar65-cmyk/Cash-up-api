import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('mensaje1')
  getMensaje1(): object {
    return {
      mensaje: 'Hola desde Azure Functions + NestJS',
      endpoint: 'GET /api/mensaje1',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('mensaje2')
  getMensaje2(): object {
    return {
      mensaje: 'Segundo endpoint funcionando correctamente',
      endpoint: 'GET /api/mensaje2',
      timestamp: new Date().toISOString(),
    };
  }
}
