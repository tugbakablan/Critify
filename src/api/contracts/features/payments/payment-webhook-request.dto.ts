import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, IsUUID } from 'class-validator';
import {
  PaymentWebhookEventType,
} from '../../../../domain/features/payments/payment-webhook-event';

export class PaymentWebhookRequestDto {
  @ApiProperty()
  @IsString()
  eventId: string;

  @ApiProperty({ enum: Object.values(PaymentWebhookEventType) })
  @IsIn(Object.values(PaymentWebhookEventType))
  type: PaymentWebhookEventType;

  @ApiProperty()
  @IsUUID()
  paymentId: string;
}
