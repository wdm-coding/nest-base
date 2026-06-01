import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Logger } from 'nestjs-pino';

@Catch()
export default class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 切换到 HTTP 上下文
    const req = ctx.getRequest<Request>(); // 获取请求对象
    const res = ctx.getResponse<Response>(); // 获取响应对象
    let code = -1;
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR as HttpStatus;
    let message = '服务器内部错误';
    // 处理 HttpException 异常
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus(); // 获取异常状态码
      const exceptionRes = exception.getResponse() as any; // 获取异常响应
      message = Array.isArray(exceptionRes.message)
        ? exceptionRes.message.join(',')
        : exceptionRes.message || exceptionRes;
    }
    // 处理 Error 异常
    if (exception instanceof Error) {
      message = exception.message;
    }
    // 处理 UnauthorizedException 异常
    if(exception instanceof UnauthorizedException){
      const exceptionRes = exception.getResponse() as any;
      if(exceptionRes.type){
        message = exceptionRes.type;
      }
      // 处理 Token 过期,需要刷新 Token
      if(exceptionRes.type === 'TOKEN_EXPIRED'){
        statusCode = 200;
        code = 4001
      }
    }
    this.logger.error(
      {
        reqId: req.id,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        statusCode
      },
      `[全局异常:] ${message}`
    );
    res.status(statusCode).json({
      code,
      message,
      data: null
    });
  }
}