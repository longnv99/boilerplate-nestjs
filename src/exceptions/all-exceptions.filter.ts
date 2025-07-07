import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let errorCode: string;
    let message: any;

    if (exceptionResponse && typeof exceptionResponse === 'object') {
      errorCode = (exceptionResponse as any)?.errorCode ?? 'E900';
      message = (exceptionResponse as any)?.message ?? '';
    }

    if (exceptionResponse && typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    }

    const { body, method, url, ip } = request;
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${method} ${url} - Status: ${status} - IP: ${ip}`;

    this.logger.error(logMessage, (exception as Error).stack);
    if (body && Object.keys(body).length > 0) {
      this.logger.error(`Request Body: ${JSON.stringify(body)}`);
    }

    const errorResponse = {
      status,
      timestamp,
      errorCode,
      message,
    };

    response.status(status).json(errorResponse);
  }
}
