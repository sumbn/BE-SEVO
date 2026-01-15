import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleAuth } from 'google-auth-library';
import { ILoggerAdapter, LogEntry } from '../interfaces/logger.interface';

/**
 * Internal Log DTO for Frontend logs
 */
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

interface GoogleSheetsRow {
  timestamp: string;
  level: string;
  service: string;
  env: string;
  correlation_id: string;
  message: string;
  context: string;
}

/**
 * Google Sheets Adapter - MVP Logging Adapter
 * 
 * Ghi logs vào Google Sheets thông qua Sheets API với Service Account.
 * 
 * Required ENV variables:
 * - GOOGLE_SHEETS_SPREADSHEET_ID
 * - GOOGLE_SERVICE_ACCOUNT_EMAIL
 * - GOOGLE_PRIVATE_KEY
 * 
 * ⚠️ CHỈ phù hợp cho MVP (< 1000 logs/ngày)
 * Khi traffic tăng, swap sang Sentry/Axiom.
 * 
 * @see docs/standards/_INDEX.md#logging-standards
 */
@Injectable()
export class GoogleSheetsAdapter implements ILoggerAdapter, OnModuleDestroy {
  private readonly logger = new Logger(GoogleSheetsAdapter.name);
  private readonly spreadsheetId: string | undefined;
  private readonly serviceAccountEmail: string | undefined;
  private readonly privateKey: string | undefined;
  private readonly sheetName: string = 'Logs';
  private readonly isEnabled: boolean;
  private auth: GoogleAuth | null = null;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  
  // Batch mechanism
  private logBuffer: GoogleSheetsRow[] = [];
  private readonly flushInterval: number = 5000; // 5 seconds
  private readonly maxBufferSize: number = 20;
  private flushTimer: NodeJS.Timeout | null = null;

  constructor(private readonly configService: ConfigService) {
    this.spreadsheetId = this.configService.get<string>('GOOGLE_SHEETS_SPREADSHEET_ID');
    this.serviceAccountEmail = this.configService.get<string>('GOOGLE_SERVICE_ACCOUNT_EMAIL');
    this.privateKey = this.configService.get<string>('GOOGLE_PRIVATE_KEY');
    
    this.isEnabled = !!(this.spreadsheetId && this.serviceAccountEmail && this.privateKey);
    
    if (!this.isEnabled) {
      this.logger.warn(
        'GoogleSheetsAdapter: Missing credentials. Required: GOOGLE_SHEETS_SPREADSHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY. Falling back to console.',
      );
    } else {
      this.initAuth();
      this.logger.log('GoogleSheetsAdapter: Initialized successfully');
      this.startFlushTimer();
    }
  }

  /**
   * Initialize Google Auth with Service Account
   */
  private initAuth(): void {
    try {
      // Parse private key - handle escaped newlines
      const privateKey = this.privateKey!.replace(/\\n/g, '\n');
      
      this.auth = new GoogleAuth({
        credentials: {
          client_email: this.serviceAccountEmail,
          private_key: privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
    } catch (error) {
      this.logger.error('Failed to initialize Google Auth', error);
    }
  }

  /**
   * Get valid access token (with auto-refresh)
   */
  private async getAccessToken(): Promise<string | null> {
    if (!this.auth) return null;
    
    // Check if token is still valid (with 5 minute buffer)
    if (this.accessToken && Date.now() < this.tokenExpiry - 300000) {
      return this.accessToken;
    }

    try {
      const client = await this.auth.getClient();
      const tokenResponse = await client.getAccessToken();
      
      if (tokenResponse.token) {
        this.accessToken = tokenResponse.token;
        // Token expires in 1 hour by default
        this.tokenExpiry = Date.now() + 3600000;
        return this.accessToken;
      }
    } catch (error) {
      this.logger.error('Failed to get access token', error);
    }
    
    return null;
  }

  async write(entry: LogEntry): Promise<void> {
    const row = this.formatRow(entry);
    
    if (!this.isEnabled) {
      // Fallback to console in development
      this.logToConsole(entry);
      return;
    }

    this.logBuffer.push(row);
    
    // Flush immediately if buffer is full or if it's an error
    if (this.logBuffer.length >= this.maxBufferSize || entry.level === 'error') {
      await this.flush();
    }
  }

  /**
   * Format log entry into spreadsheet row
   */
  private formatRow(entry: LogEntry): GoogleSheetsRow {
    const { env, service, request_id, ...context } = entry.metadata;
    
    return {
      timestamp: entry.timestamp,
      level: entry.level.toUpperCase(),
      service: (service as string) || 'unknown',
      env: (env as string) || 'unknown',
      correlation_id: (request_id as string) || '',
      message: entry.message,
      context: Object.keys(context).length > 0 ? JSON.stringify(context) : '',
    };
  }

  /**
   * Flush buffered logs to Google Sheets
   */
  private async flush(): Promise<void> {
    if (this.logBuffer.length === 0) return;
    
    const rowsToFlush = [...this.logBuffer];
    this.logBuffer = [];

    try {
      await this.appendRows(rowsToFlush);
      this.logger.debug(`Flushed ${rowsToFlush.length} logs to Google Sheets`);
    } catch (error) {
      // On failure, log to console and don't lose the logs
      this.logger.error('Failed to flush logs to Google Sheets', error);
      rowsToFlush.forEach(row => {
        console.log(`[FAILED_FLUSH] ${JSON.stringify(row)}`);
      });
    }
  }

  /**
   * Append rows to Google Sheets using Sheets API v4
   */
  private async appendRows(rows: GoogleSheetsRow[]): Promise<void> {
    const token = await this.getAccessToken();
    if (!token) {
      throw new Error('Failed to get access token');
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.sheetName}:append?valueInputOption=USER_ENTERED`;
    
    const values = rows.map(row => [
      row.timestamp,
      row.level,
      row.service,
      row.env,
      row.correlation_id,
      row.message,
      row.context,
    ]);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        values,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Sheets API error: ${response.status} - ${errorText}`);
    }
  }

  /**
   * Start periodic flush timer
   */
  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush().catch(err => {
        this.logger.error('Periodic flush failed', err);
      });
    }, this.flushInterval);
  }

  /**
   * Fallback console logging when Google Sheets is not configured
   */
  private logToConsole(entry: LogEntry): void {
    const colors = {
      info: '\x1b[36m',    // Cyan
      warn: '\x1b[33m',    // Yellow
      error: '\x1b[31m',   // Red
      reset: '\x1b[0m',
      dim: '\x1b[2m',
    };

    const color = colors[entry.level];
    const levelTag = `[${entry.level.toUpperCase().padEnd(5)}]`;
    const timestamp = new Date(entry.timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const requestId = entry.metadata.request_id 
      ? `[${(entry.metadata.request_id as string).slice(0, 8)}]` 
      : '';

    console.log(
      `${color}${levelTag}${colors.reset} ${colors.dim}${timestamp}${colors.reset} ${requestId} ${entry.message}`,
    );
  }

  /**
   * Cleanup on module destroy
   */
  onModuleDestroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    // Final flush
    this.flush().catch(() => {
      // Ignore errors on shutdown
    });
  }
}
