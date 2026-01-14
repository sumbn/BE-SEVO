export interface LogMetadata {
    env: string;
    service: string;
    request_id?: string;
    [key: string]: unknown;
}
export interface LogEntry {
    message: string;
    metadata: LogMetadata;
    timestamp: string;
    level: 'info' | 'warn' | 'error';
}
export interface ILogger {
    info(message: string, context?: Record<string, unknown>): void;
    warn(message: string, context?: Record<string, unknown>): void;
    error(message: string, error?: Error, context?: Record<string, unknown>): void;
}
export interface ILoggerAdapter {
    write(entry: LogEntry): void | Promise<void>;
}
