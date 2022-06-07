import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Response<T> {
  status: string;
  status_code: number;
  message: string;
  data: T;
}

@Injectable()
export class ApiResponse<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next
      .handle()
      .pipe(
        map((response) => ({
          status: response.status,
          status_code: context.switchToHttp().getResponse().statusCode,
          reqId: context.switchToHttp().getRequest().reqId,
          message: response.message || '',
          data: response.data,
        })),
      );
  }
}
