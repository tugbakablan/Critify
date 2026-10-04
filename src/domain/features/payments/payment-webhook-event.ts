export const PaymentWebhookEventType = {
  SUCCEEDED: 'payment.succeeded',
  FAILED: 'payment.failed',
} as const;

export type PaymentWebhookEventType =
  (typeof PaymentWebhookEventType)[keyof typeof PaymentWebhookEventType];

export interface PaymentWebhookEvent {
  eventId: string;
  type: PaymentWebhookEventType;
  paymentId: string;
}
