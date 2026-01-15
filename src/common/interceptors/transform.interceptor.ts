import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        // If the response already has the structure, return it
        if (response && response.success !== undefined) {
          return response;
        }

        // Otherwise wrap it in the standard structure
        return {
          success: true,
          data: response,
          meta: {
            timestamp: new Date().toISOString(),
          },
        };
      }),
    );
  }
}
