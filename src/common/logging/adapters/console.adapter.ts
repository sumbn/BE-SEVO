import { Injectable } from '@nestjs/common';
import { ILoggerAdapter, LogEntry } from '../interfaces/logger.interface';

/**
 * Console Adapter - Default logging adapter for development
 * 
 * Writes formatted log entries to console.
 * Future adapters: GoogleSheetsAdapter, SentryAdapter, AxiomAdapter
 */
@Injectable()
export class ConsoleAdapter implements ILoggerAdapter {
  private readonly colors = {
    info: '\x1b[36m',    // Cyan
    warn: '\x1b[33m',    // Yellow
    error: '\x1b[31m',   // Red
    reset: '\x1b[0m',    // Reset
    dim: '\x1b[2m',      // Dim
  };

  write(entry: LogEntry): void {
    const color = this.colors[entry.level];
    const reset = this.colors.reset;
    const dim = this.colors.dim;
    
    const levelTag = this.formatLevel(entry.level);
    const timestamp = this.formatTimestamp(entry.timestamp);
    const requestId = entry.metadata.request_id 
      ? `[${entry.metadata.request_id.slice(0, 8)}]` 
      : '';
    
    // Format: [LEVEL] [TIMESTAMP] [REQUEST_ID] Message
    const prefix = `${color}${levelTag}${reset} ${dim}${timestamp}${reset} ${requestId}`;
    
    console.log(`${prefix} ${entry.message}`);
    
    // Log additional context if present
    const contextKeys = Object.keys(entry.metadata).filter(
      key => !['env', 'service', 'request_id'].includes(key)
    );
    
    if (contextKeys.length > 0) {
      const context: Record<string, unknown> = {};
      contextKeys.forEach(key => {
        context[key] = entry.metadata[key];
      });
      console.log(`${dim}  └─ Context:${reset}`, context);
    }
  }

  private formatLevel(level: string): string {
    return `[${level.toUpperCase().padEnd(5)}]`;
  }

  private formatTimestamp(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
}
