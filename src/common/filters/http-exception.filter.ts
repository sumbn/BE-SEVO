import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;
      
      if (res && typeof res === 'object' && res.error && typeof res.error === 'object') {
        message = res.error.message || exception.message;
        errorCode = res.error.code || this.generateErrorCode(status, message);
      } else {
        message = typeof res === 'string' ? res : res.message || exception.message;
        // If message is in UPPER_SNAKE_CASE, use it as errorCode
        const isCode = /^[A-Z0-9_]+$/.test(message);
        errorCode = res.errorCode || (isCode ? message : this.generateErrorCode(status, message));
      }
    } else {
      console.error('Unhandled Exception:', exception);
    }

    // Try to translate the message using the error code
    try {
      const translatedMessage = await this.i18n.translate(`common.errors.${errorCode}`, {
        lang: host.switchToHttp().getRequest().i18nLang,
      });
      
      // If translation exists (not returning the key itself), use it
      if (translatedMessage && translatedMessage !== `common.errors.${errorCode}`) {
        message = translatedMessage;
      }
    } catch (error) {
      // Fallback to original message if translation fails
    }

    response.status(status).json({
      success: false,
      data: null,
      error: {
        code: errorCode,
        message: message,
      }
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
