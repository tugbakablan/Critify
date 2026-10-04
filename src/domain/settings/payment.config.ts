import { registerAs } from '@nestjs/config';

export class PaymentConfig {
  static KEY = PaymentConfig.name;
  webhookSecret: string;
  webhookUrl: string;
}

export const PaymentConfiguration = registerAs(
  PaymentConfig.KEY,
  (): PaymentConfig => ({
    webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET,
    webhookUrl: process.env.PAYMENT_WEBHOOK_URL ?? 'http://localhost:3000/api/v1/webhooks/payment',
  }),
);
