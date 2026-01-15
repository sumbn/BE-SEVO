import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { IsString, IsIn, IsOptional, IsObject, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { LoggingService } from './logging.service';

/**
 * Frontend Log Entry DTO
 */
class FrontendLogMetaDto {
  @IsOptional()
  @IsString()
  correlation_id?: string;

  @IsOptional()
  @IsString()
  browser?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  component?: string;

  @IsOptional()
  @IsString()
  user_id?: string;
}

class FrontendLogEntryDto {
  @IsString()
  message: string;

  @IsIn(['info', 'warn', 'error'])
  level: 'info' | 'warn' | 'error';

  @IsObject()
  @ValidateNested()
  @Type(() => FrontendLogMetaDto)
  metadata: FrontendLogMetaDto;

  @IsString()
  timestamp: string;
}

class BatchLogsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FrontendLogEntryDto)
  logs: FrontendLogEntryDto[];
}

/**
 * Internal Logs Controller
 * 
 * Endpoint for Frontend to send batched logs to Backend.
 * 
 * ⚠️ This is an INTERNAL endpoint - should not be exposed publicly.
 * In production, consider:
 * - IP whitelisting
 * - Rate limiting
 * - API key verification
 * 
 * @see docs/standards/_INDEX.md#logging-standards
 */
@Controller('logs')
export class InternalLogsController {
  constructor(private readonly loggingService: LoggingService) {}

  /**
   * Receive batched logs from Frontend
   * 
   * POST /api/internal/logs
   * Body: { logs: FrontendLogEntry[] }
   */
  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async receiveLogs(@Body() body: BatchLogsDto): Promise<{ received: number }> {
    const { logs } = body;
    
    // Process each log entry
    for (const logEntry of logs) {
      const context = {
        source: 'frontend',
        browser: logEntry.metadata.browser,
        url: logEntry.metadata.url,
        component: logEntry.metadata.component,
        user_id: logEntry.metadata.user_id,
        correlation_id: logEntry.metadata.correlation_id,
        original_timestamp: logEntry.timestamp,
      };

      switch (logEntry.level) {
        case 'info':
          this.loggingService.info(`[FE] ${logEntry.message}`, context);
          break;
        case 'warn':
          this.loggingService.warn(`[FE] ${logEntry.message}`, context);
          break;
        case 'error':
          this.loggingService.error(`[FE] ${logEntry.message}`, undefined, context);
          break;
      }
    }

    return { received: logs.length };
  }
}
