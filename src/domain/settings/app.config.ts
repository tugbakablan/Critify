import { registerAs } from '@nestjs/config';

export class AppConfig {
  static KEY = AppConfig.name;
  port: number;
}

export const AppConfiguration = registerAs(
  AppConfig.KEY,
  (): AppConfig => ({
    port: Number(process.env.APP_PORT ?? 3000),
  }),
);
