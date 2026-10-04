import { DataSource } from 'typeorm';
import { DatabaseConfig, DatabaseConfiguration } from '../../domain/settings';

const db = DatabaseConfiguration() as DatabaseConfig;

export default new DataSource({
  type: 'postgres',
  host: db.host,
  port: db.port,
  username: db.username,
  password: db.password,
  database: db.database,
  entities: [__dirname + '/../../**/*.entity.{ts,js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
});
