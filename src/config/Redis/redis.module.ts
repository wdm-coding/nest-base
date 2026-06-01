import { Module, Global } from '@nestjs/common';
import { RedisClient } from './redis.client';
import { RedisService } from './redis.service';
@Global()
@Module({
  providers: [RedisClient, RedisService],
  exports: [RedisService], // 导出给全项目使用
})
export class RedisModule {}