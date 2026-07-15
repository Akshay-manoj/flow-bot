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

    const exceptionResponse: any = exception instanceof HttpException ? exception.getResponse() : null;
    const message = exceptionResponse?.message || exception.message || 'Internal server error';

    const logEntry = {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      status,
      message: message,
      stack: exception.stack,
    };

    globalLogs.push(logEntry);
    if (globalLogs.length > 50) {
      globalLogs.shift(); // keep last 50 logs
    }

    if (status >= 500) {
      console.error(`[${status}] ${request.method} ${request.url}`, exception.stack);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      error: exceptionResponse?.error || 'Error',
    });
  }
}
