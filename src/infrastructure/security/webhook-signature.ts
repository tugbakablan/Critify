import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';
import { PaymentConfig } from '../../domain/settings';

const TOLERANCE_SECONDS = 300;

@Injectable()
export class WebhookSignature {
  constructor(private readonly configService: ConfigService) {}

  sign(rawBody: string, timestamp = Math.floor(Date.now() / 1000)): string {
    return `t=${timestamp},v1=${this.compute(timestamp, rawBody)}`;
  }

  verify(header: string | undefined, rawBody: Buffer | undefined): boolean {
    if (!header || !rawBody) {
      return false;
    }

    const parts = new Map(
      header.split(',').map((part) => part.split('=') as [string, string]),
    );
    const timestamp = Number(parts.get('t'));
    const received = parts.get('v1');
    if (!Number.isInteger(timestamp) || !received) {
      return false;
    }

    const age = Math.abs(Math.floor(Date.now() / 1000) - timestamp);
    if (age > TOLERANCE_SECONDS) {
      return false;
    }

    const expected = Buffer.from(this.compute(timestamp, rawBody.toString('utf8')), 'hex');
    const actual = Buffer.from(received, 'hex');
    return (
      actual.length === expected.length &&
      timingSafeEqual(Uint8Array.from(actual), Uint8Array.from(expected))
    );
  }

  private compute(timestamp: number, rawBody: string): string {
    const secret = this.configService.get<PaymentConfig>(PaymentConfig.KEY).webhookSecret;
    return createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');
  }
}
