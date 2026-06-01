// 全局响应拦截器
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface Response<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable()
export default class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse();
    response.status(HttpStatus.OK);
    return next.handle().pipe(
      map((params) => {
        return {
          code: params.code || 0,
          message: params.message || '操作成功', // 可以设置默认成功消息
          data: params.data || null
        }
      }),
    );
  }
}