import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { StorageConfig } from '../../domain/settings';

@Injectable()
export class StorageService {
  private readonly client: Client;
  private readonly bucket: string;

  constructor(configService: ConfigService) {
    const config = configService.get<StorageConfig>(StorageConfig.KEY);
    this.client = new Client({
      endPoint: config.endpoint,
      port: config.port,
      useSSL: config.useSSL,
      accessKey: config.accessKey,
      secretKey: config.secretKey,
      region: config.region,
    });
    this.bucket = config.bucket;
  }

  async upload(objectKey: string, content: Buffer, mimeType: string): Promise<void> {
    await this.client.putObject(this.bucket, objectKey, content, content.length, {
      'Content-Type': mimeType,
    });
  }

  getPresignedUrl(objectKey: string, expirySeconds = 3600): Promise<string> {
    return this.client.presignedGetObject(this.bucket, objectKey, expirySeconds);
  }
}
