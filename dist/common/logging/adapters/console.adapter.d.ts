import { ILoggerAdapter, LogEntry } from '../interfaces/logger.interface';
export declare class ConsoleAdapter implements ILoggerAdapter {
    private readonly colors;
    write(entry: LogEntry): void;
    private formatLevel;
    private formatTimestamp;
}
