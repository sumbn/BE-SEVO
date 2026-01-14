import { Injectable, Inject, Scope } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { ConfigService as ConfigServiceClass } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import type { ILoggerAdapter } from './interfaces/logger.interface';
import type { ILogger } from './interfaces/logger.interface';
import { LogEntry, LogMetadata } from './interfaces/logger.interface';

/** Injection token for Logger Adapter */
export const LOGGER_ADAPTER = Symbol('LOGGER_ADAPTER');

/**
 * LoggingService - Shared Kernel Logging Service
 * 
 * ⚠️ MANDATORY: Business logic PHẢI sử dụng service này để log.
 * ❌ KHÔNG ĐƯỢC gọi trực tiếp console.log hoặc logger trong business logic.
 * 
 * Features:
 * - Auto-inject metadata (env, service, request_id)
 * - Sanitize sensitive data trước khi log
 * - Adapter pattern cho flexibility
 * 
 * @see docs/standards/_INDEX.md#logging-standards
 */
@Injectable({ scope: Scope.REQUEST })
export class LoggingService implements ILogger {
  private readonly env: string;
  private readonly service: string = 'backend';
  private readonly sensitiveKeys = ['password', 'token', 'secret', 'authorization', 'cookie'];

  constructor(
    @Inject(LOGGER_ADAPTER) private readonly adapter: ILoggerAdapter,
    @Inject(ConfigServiceClass) private readonly configService: ConfigService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    this.env = this.configService.get<string>('NODE_ENV', 'development');
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    const errorContext = error 
      ? { 
          error_name: error.name, 
          error_message: error.message,
          stack: this.env === 'development' ? error.stack : undefined,
          ...context 
        }
      : context;
    
    this.log('error', message, errorContext);
  }

  private log(
    level: 'info' | 'warn' | 'error', 
    message: string, 
    context?: Record<string, unknown>
  ): void {
    const metadata = this.buildMetadata(context);
    
    const entry: LogEntry = {
      message,
      metadata,
      timestamp: new Date().toISOString(),
      level,
    };

    this.adapter.write(entry);
  }

  private buildMetadata(context?: Record<string, unknown>): LogMetadata {
    const requestId = this.extractRequestId();
    
    const sanitizedContext = context 
      ? this.sanitize(context) 
      : {};

    return {
      env: this.env,
      service: this.service,
      request_id: requestId,
      ...sanitizedContext,
    };
  }

  private extractRequestId(): string | undefined {
    // Try to get request_id from headers or generate one
    return (
      this.request?.headers?.['x-request-id'] as string ||
      this.request?.headers?.['x-correlation-id'] as string ||
      undefined
    );
  }

  /**
   * Sanitize sensitive data before logging
   * 
   * ⚠️ MANDATORY: Không được log password, tokens, secrets
   */
  private sanitize(obj: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (this.sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitize(value as Record<string, unknown>);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
}
