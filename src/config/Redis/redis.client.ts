import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { Env } from '@/enum/env.enum';

@Injectable()
export class RedisClient extends Redis {
  constructor(configService: ConfigService) {
    super({
      host: configService.get(Env.REDIS_HOST),
      port: configService.get(Env.REDIS_PORT),
      password: configService.get(Env.REDIS_PASSWORD),
      db: configService.get(Env.REDIS_DB),
    });
  }
}