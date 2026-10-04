import { registerAs } from '@nestjs/config';

export class DatabaseConfig {
  static KEY = DatabaseConfig.name;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export const DatabaseConfiguration = registerAs(
  DatabaseConfig.KEY,
  (): DatabaseConfig => ({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }),
);
