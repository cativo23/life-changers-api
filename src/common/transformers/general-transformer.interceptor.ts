import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { catchError, map, Observable } from 'rxjs';

export interface Response<T> {
  status: string;
  status_code: number;
  message: string;
  data: T;
  meta: T;
}

@Injectable()
export class ApiResponse<T> implements NestInterceptor<T, Response<T>> {

  constructor(private reflector: Reflector) { }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {

    const shouldSkip = this.shouldSkip(context);

    if (shouldSkip) {
      return next.handle();
    }

    return next.handle().pipe(
      catchError(async (err) => ({
        status: 'error',
        status_code: err.status,
        message: err.message,
        data: err,
        meta: null,
      })),
      map((response) => ({
        status: response.status,
        status_code: response.status_code|| context.switchToHttp().getResponse().statusCode,
        message: response.message || '',
        data: response.data?.data || response.data,
        meta: response.data?.meta,
      }))
    );
  }

  shouldSkip(context: ExecutionContext): Boolean {
    const decoratorSkip =
      this.reflector.get('skip_api_response', context.getClass()) ||
      this.reflector.get('skip_api_response', context.getHandler());
    if (decoratorSkip) {
      return true;
    }

    return false;
  }
}
