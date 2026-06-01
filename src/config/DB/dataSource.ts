import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './database.config';
const config = getDatabaseConfig();
export default new DataSource({
  ...(config as any),
  migrations:['src/migrations/*.ts'], // 数据库迁移文件路径
});