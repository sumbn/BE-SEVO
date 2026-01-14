import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            correlationId?: string;
        }
    }
}
export declare class CorrelationIdMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
}
