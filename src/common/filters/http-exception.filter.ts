import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;
      message = typeof res === 'string' ? res : res.message || exception.message;
      
      // Attempt to extract custom error code if present, otherwise generate from message
      errorCode = res.errorCode || this.generateErrorCode(status, message);
    } else {
      console.error('Unhandled Exception:', exception);
    }

    response.status(status).json({
      message,
      errorCode,
      statusCode: status,
    });
  }

  private generateErrorCode(status: number, message: string): string {
    // Default mappings for common status codes if no specific code provided
    if (status === 401) return 'AUTH_UNAUTHORIZED';
    if (status === 403) return 'AUTH_FORBIDDEN';
    if (status === 404) return 'RESOURCE_NOT_FOUND';
    if (status === 400) return 'VALIDATION_ERROR';
    if (status === 409) return 'CONFLICT_ERROR';
    
    return 'INTERNAL_SERVER_ERROR';
  }
}
