import { registerAs } from '@nestjs/config';

export class JwtConfig {
  static KEY = JwtConfig.name;
  secret: string;
  expiresIn: string;
}

export const JwtConfiguration = registerAs(
  JwtConfig.KEY,
  (): JwtConfig => ({
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  }),
);
