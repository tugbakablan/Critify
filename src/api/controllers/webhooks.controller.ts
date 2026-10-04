import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  RawBodyRequest,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiExcludeController } from '@nestjs/swagger';
import { Request } from 'express';
import { ProcessPaymentWebhookCommand } from '../../application/features/payments/commands/process-payment-webhook/process-payment-webhook.command';
import { WebhookSignature } from '../../infrastructure/security/webhook-signature';
import { PaymentWebhookRequestDto } from '../contracts/features/payments/payment-webhook-request.dto';

@ApiExcludeController()
@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly signature: WebhookSignature,
  ) {}

  @Post('payment')
  @HttpCode(HttpStatus.OK)
  async payment(
    @Req() request: RawBodyRequest<Request>,
    @Headers('x-signature') signatureHeader: string | undefined,
    @Body() body: PaymentWebhookRequestDto,
  ): Promise<{ received: true }> {
    if (!this.signature.verify(signatureHeader, request.rawBody)) {
      throw new UnauthorizedException('Geçersiz webhook imzası.');
    }
    await this.commandBus.execute(new ProcessPaymentWebhookCommand(body.type, body.paymentId));
    return { received: true };
  }
}
