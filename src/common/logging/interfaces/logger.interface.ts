/**
 * ILogger Interface - Logging Abstraction Layer
 * 
 * Theo Logging Standards: Interface Pattern để dễ swap adapter
 * mà không đổi Business Logic.
 * 
 * @see docs/standards/_INDEX.md#logging-standards
 */

export interface LogMetadata {
  /** Environment: development / production */
  env: string;
  
  /** Service identifier: backend / frontend */
  service: string;
  
  /** Unique request identifier */
  request_id?: string;
  
  /** Additional context data */
  [key: string]: unknown;
}

export interface LogEntry {
  /** Log message */
  message: string;
  
  /** Metadata (env, service, request_id, ...) */
  metadata: LogMetadata;
  
  /** ISO 8601 timestamp */
  timestamp: string;
  
  /** Log level */
  level: 'info' | 'warn' | 'error';
}

/**
 * Logger Interface
 * 
 * Tất cả logging adapters PHẢI implement interface này.
 * Business logic chỉ interact với interface, không phải concrete implementation.
 */
export interface ILogger {
  /**
   * Log informational message
   */
  info(message: string, context?: Record<string, unknown>): void;
  
  /**
   * Log warning message
   */
  warn(message: string, context?: Record<string, unknown>): void;
  
  /**
   * Log error message
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): void;
}

/**
 * Logger Adapter Interface
 * 
 * Adapters implement this interface để handle actual log persistence/transport.
 */
export interface ILoggerAdapter {
  /**
   * Write log entry to destination (console, file, external service, etc.)
   */
  write(entry: LogEntry): void | Promise<void>;
}
