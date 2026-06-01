import { Module, Global,Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import EnvConfigModule from './config/Env/EnvConfig';
import { UserModule } from './modules/user/user.module';
import { RolesModule } from './modules/role/roles.module';
import { MenuModule } from './modules/menu/menu.module';
import { AuthModule } from './modules/auth/auth.module';
import TypeOrmConfigModule from '@/config/DB/TypeOrmConfig';
import PinoLoggerModule from '@/config/Logger/PinoLogger';
import { RedisModule } from '@/config/Redis/redis.module';
@Global()
@Module({
  imports: [
    EnvConfigModule, // 环境变量配置
    PinoLoggerModule, // 日志配置
    TypeOrmConfigModule, // 数据库配置
    RedisModule, // Redis配置
    // 功能模块
    AuthModule,
    UserModule,
    RolesModule,
    MenuModule,
  ],
  controllers: [AppController],
  providers: [AppService,Logger],
  exports: [Logger],
 })
export class AppModule { }
