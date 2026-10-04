import { registerAs } from '@nestjs/config';

export class StorageConfig {
  static KEY = StorageConfig.name;
  endpoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  bucket: string;
  region: string;
}

export const StorageConfiguration = registerAs(
  StorageConfig.KEY,
  (): StorageConfig => ({
    endpoint: process.env.STORAGE_ENDPOINT,
    port: Number(process.env.STORAGE_PORT ?? 9000),
    useSSL: process.env.STORAGE_USE_SSL === 'true',
    accessKey: process.env.STORAGE_ACCESS_KEY,
    secretKey: process.env.STORAGE_SECRET_KEY,
    bucket: process.env.STORAGE_BUCKET,
    region: 'us-east-1',
  }),
);
