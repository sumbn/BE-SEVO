import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ILoggerAdapter, LogEntry } from '../interfaces/logger.interface';
export interface FrontendLogEntry {
    message: string;
    level: 'info' | 'warn' | 'error';
    metadata: {
        correlation_id?: string;
        browser?: string;
        url?: string;
        component?: string;
        user_id?: string;
        [key: string]: unknown;
    };
    timestamp: string;
}
export declare class GoogleSheetsAdapter implements ILoggerAdapter, OnModuleDestroy {
    private readonly configService;
    private readonly logger;
    private readonly spreadsheetId;
    private readonly serviceAccountEmail;
    private readonly privateKey;
    private readonly sheetName;
    private readonly isEnabled;
    private auth;
    private accessToken;
    private tokenExpiry;
    private logBuffer;
    private readonly flushInterval;
    private readonly maxBufferSize;
    private flushTimer;
    constructor(configService: ConfigService);
    private initAuth;
    private getAccessToken;
    write(entry: LogEntry): Promise<void>;
    private formatRow;
    private flush;
    private appendRows;
    private startFlushTimer;
    private logToConsole;
    onModuleDestroy(): void;
}
