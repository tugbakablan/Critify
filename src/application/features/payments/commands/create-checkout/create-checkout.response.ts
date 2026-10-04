import { ApiProperty } from '@nestjs/swagger';
import { PaymentResponse } from '../../payment.response';

export class CreateCheckoutResponse {
  @ApiProperty({ type: PaymentResponse })
  payment: PaymentResponse;

  @ApiProperty({ example: '/api/v1/payments/<id>/mock-confirm' })
  mockConfirmUrl: string;

  static create(payment: PaymentResponse): CreateCheckoutResponse {
    const response = new CreateCheckoutResponse();
    response.payment = payment;
    response.mockConfirmUrl = `/api/v1/payments/${payment.id}/mock-confirm`;
    return response;
  }
}
