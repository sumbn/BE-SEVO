import type { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import type { ILoggerAdapter } from './interfaces/logger.interface';
import type { ILogger } from './interfaces/logger.interface';
export declare const LOGGER_ADAPTER: unique symbol;
export declare class LoggingService implements ILogger {
    private readonly adapter;
    private readonly configService;
    private readonly request;
    private readonly env;
    private readonly service;
    private readonly sensitiveKeys;
    constructor(adapter: ILoggerAdapter, configService: ConfigService, request: Request);
    info(message: string, context?: Record<string, unknown>): void;
    warn(message: string, context?: Record<string, unknown>): void;
    error(message: string, error?: Error, context?: Record<string, unknown>): void;
    private log;
    private buildMetadata;
    private extractRequestId;
    private sanitize;
}
