import { LoggingService } from './logging.service';
declare class FrontendLogMetaDto {
    correlation_id?: string;
    browser?: string;
    url?: string;
    component?: string;
    user_id?: string;
}
declare class FrontendLogEntryDto {
    message: string;
    level: 'info' | 'warn' | 'error';
    metadata: FrontendLogMetaDto;
    timestamp: string;
}
declare class BatchLogsDto {
    logs: FrontendLogEntryDto[];
}
export declare class InternalLogsController {
    private readonly loggingService;
    constructor(loggingService: LoggingService);
    receiveLogs(body: BatchLogsDto): Promise<{
        received: number;
    }>;
}
export {};
