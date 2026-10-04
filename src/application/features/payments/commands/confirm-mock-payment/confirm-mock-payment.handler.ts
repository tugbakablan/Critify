import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../../../../../domain/features/payments/payment.entity';
import { PaymentStatus } from '../../../../../domain/features/payments/payment-status';
import { PaymentWebhookEventType } from '../../../../../domain/features/payments/payment-webhook-event';
import { MockPaymentProvider } from '../../../../../infrastructure/payment/mock-payment-provider';
import { PaymentResponse } from '../../payment.response';
import { ConfirmMockPaymentCommand } from './confirm-mock-payment.command';

@CommandHandler(ConfirmMockPaymentCommand)
export class ConfirmMockPaymentHandler implements ICommandHandler<ConfirmMockPaymentCommand> {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly payments: Repository<PaymentEntity>,
    private readonly provider: MockPaymentProvider,
  ) {}

  async execute(command: ConfirmMockPaymentCommand): Promise<PaymentResponse> {
    const payment = await this.payments.findOneBy({ id: command.paymentId });
    if (!payment) {
      throw new NotFoundException('Ödeme bulunamadı.');
    }
    if (payment.userId !== command.userId) {
      throw new ForbiddenException('Bu ödeme başka bir kullanıcıya ait.');
    }
    if (payment.status !== PaymentStatus.PENDING) {
      throw new ConflictException('Bu ödeme zaten sonuçlanmış.');
    }

    await this.provider.sendWebhook({
      eventId: randomUUID(),
      type: command.succeed ? PaymentWebhookEventType.SUCCEEDED : PaymentWebhookEventType.FAILED,
      paymentId: payment.id,
    });

    const updated = await this.payments.findOne({
      where: { id: payment.id },
      relations: { plan: true },
    });
    return PaymentResponse.create(updated);
  }
}
