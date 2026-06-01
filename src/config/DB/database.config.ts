import yamlConfig from '../Env/yamlConfig'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import {join} from 'path'
const db = yamlConfig().db
export const getDatabaseConfig = ():TypeOrmModuleOptions =>  ({
  type:'mysql', // 数据库类型
  host:db.host, // 数据库主机
  port:db.port, // 数据库端口
  username:db.username, // 数据库用户名
  password:db.password, // 数据库密码
  database:db.database, // 数据库名称
  entities:[join(__dirname, '../../**/*.entity{.ts,.js}')], // 实体类路径
  synchronize:db.synchronize, // 是否同步数据库
  migrationsRun:db.migrationsRun, // 是否运行数据库迁移
  logging:db.logging, // 是否开启日志
})
 
