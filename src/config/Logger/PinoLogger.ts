import { LoggerModule } from 'nestjs-pino';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { Env } from '@/enum/env.enum';
@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const idDev = configService.get('NODE_ENV') === 'development';
        const targets = []
        if(idDev){
          targets.push({ // 控制台输出
            level:'info',
            target: 'pino-pretty',
            options: {
              levelFirst:true,
              colorize: true,
              translateTime: 'yyyy-mm-dd HH:MM:ss',
              ignore: 'pid,hostname',
              singleLine: true,
              sync: true
            },
          })
        }
        if(configService.get(Env.PINO_IS_ROLL)){
          targets.push({ // 文件输出
            level:'info',
            target: 'pino-roll',
            options: {
              file: join(process.cwd(), 'logs', 'info'),// 日志文件路径
              size: '10M',// 日志文件大小 当日志文件超过此大小时，会触发滚动
              frequency: 'daily', // 日志滚动频率 每天
              extension: '.log', // 日志文件扩展名
              mkdir: true, // 自动创建目录
              maxSize: '100', // 当日志总占用超过此值时，会删除最旧的文件。
              maxFiles: 10, // 最大保留的文件数量（默认保留4个）
              compress: true, // 是否压缩日志文件
              dateFormat: 'yyyy-MM-dd' // 日志文件日期格式
            },
          })
        }
        return {
          pinoHttp: {
            // 1. 日志级别
            level: configService.get(Env.PINO_LEVEL),
            // 2. 生成请求ID
            genReqId: (req) => req.headers['x-request-id'] || new Date().getTime().toString(),
            // 3. 静默请求日志，只在请求结束时打印
            quietReqLogger: true,
            // 4. 自动日志配置
            autoLogging: {
              ignore: (req) => req.url === '/health',
            },
            // 5. 动态日志级别
            customLogLevel: (req, res, error) => {
              if (res.statusCode >= 500 || error) return 'error';
              if (res.statusCode >= 400) return 'warn';
              return 'info';
            },
            transport: {
              targets: targets
            }
          },
        }
      },
    }),
  ],
  exports: [PinoLoggerModule],
})
export default class PinoLoggerModule {}