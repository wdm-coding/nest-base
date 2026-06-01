
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './database.config'
import {join} from 'path'
const TypeOrmConfigModule = TypeOrmModule.forRoot({
  ...getDatabaseConfig(),
  migrations: [join(__dirname, '../../**/migrations/*{.ts,.js}')] // 数据库迁移文件路径
})
export default TypeOrmConfigModule;