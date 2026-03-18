import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

function normalizeMessage(response: unknown): string | string[] {
  if (typeof response === 'string') return response;
  if (response && typeof response === 'object') {
    const anyResp = response as any;
    if (typeof anyResp.message === 'string') return anyResp.message;
    if (Array.isArray(anyResp.message)) return anyResp.message;
    if (typeof anyResp.error === 'string') return anyResp.error;
  }
  return 'Error';
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<any>();

    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttp ? exception.getResponse() : undefined;
    const message = isHttp
      ? normalizeMessage(exceptionResponse)
      : 'Error interno del servidor';

    const errorName =
      (exception as any)?.name ?? (isHttp ? 'HttpException' : 'Error');

    const body = {
      statusCode: status,
      error: errorName,
      message,
      path: request?.url,
      method: request?.method,
      timestamp: new Date().toISOString(),
    };

    httpAdapter.reply(ctx.getResponse(), body, status);
  }
}