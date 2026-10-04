import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentWebhookEvent } from '../../domain/features/payments/payment-webhook-event';
import { PaymentConfig } from '../../domain/settings';
import { WebhookSignature } from '../security/webhook-signature';

@Injectable()
export class MockPaymentProvider {
  constructor(
    private readonly configService: ConfigService,
    private readonly signature: WebhookSignature,
  ) {}

  async sendWebhook(event: PaymentWebhookEvent): Promise<void> {
    const { webhookUrl } = this.configService.get<PaymentConfig>(PaymentConfig.KEY);
    const rawBody = JSON.stringify(event);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': this.signature.sign(rawBody),
      },
      body: rawBody,
    });

    if (!response.ok) {
      throw new BadGatewayException(`Ödeme webhook'u ${response.status} döndü.`);
    }
  }
}
