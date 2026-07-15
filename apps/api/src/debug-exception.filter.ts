import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

export const globalLogs: any[] = [];

@Catch()
export class DebugExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const logEntry = {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      status,
      message: exception.message || exception,
      stack: exception.stack,
    };

    globalLogs.push(logEntry);
    if (globalLogs.length > 50) {
      globalLogs.shift(); // keep last 50 logs
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: exception.message || 'Internal server error',
      stack: exception.stack,
    });
  }
}
