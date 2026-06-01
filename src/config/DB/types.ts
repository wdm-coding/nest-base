export interface TypeOrmConfigProps {
  type: 'mysql';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  entities: string[];
  migrations: string[];
  synchronize: boolean;
  migrationsRun: boolean;
  logging: boolean;
}
