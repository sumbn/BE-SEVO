import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

// Extend Express Request type to include correlationId
declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
    }
  }
}

/**
 * Correlation ID Middleware
 * 
 * Extracts X-Correlation-ID from incoming request headers
 * or generates a new UUID if not present.
 * 
 * This enables end-to-end tracing from Frontend → Backend.
 * 
 * @see docs/standards/_INDEX.md#logging-standards
 */
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    // Try to extract from headers (FE sends this)
    const existingId = 
      req.headers['x-correlation-id'] as string ||
      req.headers['x-request-id'] as string;
    
    // Use existing or generate new
    const correlationId = existingId || randomUUID();
    
    // Attach to request object for downstream services
    req.correlationId = correlationId;
    
    // Also set in headers for consistency
    req.headers['x-correlation-id'] = correlationId;
    
    // Set in response headers so FE can track
    res.setHeader('X-Correlation-ID', correlationId);
    
    next();
  }
}
