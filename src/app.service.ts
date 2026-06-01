import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/enum/env.enum';
@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}   
  getHello(): any {
    return {
      appName: this.configService.get(Env.APP_NAME),
      host: this.configService.get(Env.HOST),
      port: this.configService.get(Env.PORT),
    }
  }
}