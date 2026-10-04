import { ApiProperty } from '@nestjs/swagger';
import { PaymentEntity } from '../../../domain/features/payments/payment.entity';
import { PaymentStatus } from '../../../domain/features/payments/payment-status';

export class PaymentResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  planCode: string;

  @ApiProperty()
  amountCents: number;

  @ApiProperty()
  currency: string;

  @ApiProperty({ enum: Object.values(PaymentStatus) })
  status: PaymentStatus;

  @ApiProperty()
  createdAt: Date;

  static create(payment: PaymentEntity): PaymentResponse {
    const response = new PaymentResponse();
    response.id = payment.id;
    response.planCode = payment.plan.code;
    response.amountCents = payment.amountCents;
    response.currency = payment.currency;
    response.status = payment.status;
    response.createdAt = payment.createdAt;
    return response;
  }
}
