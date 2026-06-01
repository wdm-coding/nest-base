import { Injectable } from '@nestjs/common';
import { RedisClient } from './redis.client';

@Injectable()
export class RedisService {
  constructor(private readonly redis: RedisClient) {}
  
  /**
   * 设置缓存
   * @param key 键
   * @param value 值
   * @param ttl 过期时间（秒）
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const data = JSON.stringify(value);
    if (ttl) {
      await this.redis.set(key, data, 'EX', ttl);
    } else {
      await this.redis.set(key, data);
    }
  }

  /**
   * 获取缓存
   */
  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return data as T;
    }
  }

  /**
   * 删除缓存
   */
  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  /**
   * 判断 key 是否存在
   */
  async exists(key: string): Promise<boolean> {
    const res = await this.redis.exists(key);
    return res === 1;
  }

  async keys(pattern: string): Promise<string[]> {
    return this.redis.keys(pattern);
  }
}