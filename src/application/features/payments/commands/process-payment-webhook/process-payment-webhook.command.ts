import { PaymentWebhookEventType } from '../../../../../domain/features/payments/payment-webhook-event';

export class ProcessPaymentWebhookCommand {
  constructor(
    public readonly type: PaymentWebhookEventType,
    public readonly paymentId: string,
  ) {}
}
