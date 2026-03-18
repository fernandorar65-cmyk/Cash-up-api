import { Controller, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Controller()
@UseFilters(HttpExceptionFilter)
export class AppController {
  // Sin endpoints en el root controller.
}
