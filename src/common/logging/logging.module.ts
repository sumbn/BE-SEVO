import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggingService, LOGGER_ADAPTER } from './logging.service';
import { ConsoleAdapter } from './adapters/console.adapter';
import { GoogleSheetsAdapter } from './adapters/google-sheets.adapter';
import { InternalLogsController } from './internal-logs.controller';

/**
 * LoggingModule - Global Logging Module
 * 
 * Provides LoggingService globally to all modules.
 * 
 * Adapter selection:
 * - Production with Google Sheets credentials: GoogleSheetsAdapter
 * - Development or missing credentials: ConsoleAdapter
 * 
 * Usage in any service:
 * ```typescript
 * constructor(private readonly logger: LoggingService) {}
 * 
 * someMethod() {
 *   this.logger.info('User logged in', { userId: '123' });
 *   this.logger.warn('Rate limit approaching', { current: 95 });
 *   this.logger.error('Payment failed', error, { orderId: 'xyz' });
 * }
 * ```
 * 
 * @see docs/standards/_INDEX.md#logging-standards
 */
@Global()
@Module({
  imports: [ConfigModule],
  controllers: [InternalLogsController],
  providers: [
    // Dynamic adapter provider based on environment
    {
      provide: LOGGER_ADAPTER,
      useFactory: (configService: ConfigService) => {
        const hasGoogleSheets = 
          configService.get('GOOGLE_SHEETS_SPREADSHEET_ID') && 
          configService.get('GOOGLE_SERVICE_ACCOUNT_EMAIL') &&
          configService.get('GOOGLE_PRIVATE_KEY');
        
        // Use GoogleSheetsAdapter if credentials are available
        if (hasGoogleSheets) {
          return new GoogleSheetsAdapter(configService);
        }
        
        // Fallback to ConsoleAdapter
        return new ConsoleAdapter();
      },
      inject: [ConfigService],
    },
    LoggingService,
  ],
  exports: [LoggingService],
})
export class LoggingModule {}
