import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import yamlConfig from '@/config/Env/yamlConfig';
import { Env } from '@/enum/env.enum';
import { Logger } from 'nestjs-pino';
import AllExceptionFilter from '@/common/filters/all-exception.filter';
import TransformInterceptor from '@/common/interceptors/transform.interceptor';
import cookieParser from 'cookie-parser';
const envConfig = yamlConfig();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // 开启日志缓冲存，避免日志丢失
  });
  // 全局注册 Cookie 解析中间件
  app.use(cookieParser())
  // 注入 Pino 全局日志
  const pinoLogger = app.get(Logger);
  app.useLogger(pinoLogger);
  // 全局注册响应拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  // 注册全局异常过滤器，并注入 pino
  app.useGlobalFilters(new AllExceptionFilter(pinoLogger));
  await app.listen(envConfig[Env.PORT] ?? 3000);
  console.log(`✅ 服务启动成功: http://${envConfig[Env.HOST]}:${envConfig[Env.PORT]}/`);
}

bootstrap();
