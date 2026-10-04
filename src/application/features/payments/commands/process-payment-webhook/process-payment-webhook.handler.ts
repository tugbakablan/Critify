import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { EntitlementEntity } from '../../../../../domain/features/payments/entitlement.entity';
import { PaymentEntity } from '../../../../../domain/features/payments/payment.entity';
import { PaymentStatus } from '../../../../../domain/features/payments/payment-status';
import { PaymentWebhookEventType } from '../../../../../domain/features/payments/payment-webhook-event';
import { PlanEntity } from '../../../../../domain/features/payments/plan.entity';
import { ProcessPaymentWebhookCommand } from './process-payment-webhook.command';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

@CommandHandler(ProcessPaymentWebhookCommand)
export class ProcessPaymentWebhookHandler implements ICommandHandler<ProcessPaymentWebhookCommand> {
  constructor(private readonly dataSource: DataSource) {}

  async execute(command: ProcessPaymentWebhookCommand): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const payment = await manager.findOne(PaymentEntity, {
        where: { id: command.paymentId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!payment) {
        throw new NotFoundException('Ödeme bulunamadı.');
      }
      if (payment.status !== PaymentStatus.PENDING) {
        return;
      }

      if (command.type === PaymentWebhookEventType.FAILED) {
        payment.status = PaymentStatus.FAILED;
        await manager.save(payment);
        return;
      }

      payment.status = PaymentStatus.SUCCEEDED;
      await manager.save(payment);

      const plan = await manager.findOneByOrFail(PlanEntity, { id: payment.planId });
      await manager.insert(EntitlementEntity, {
        userId: payment.userId,
        planId: plan.id,
        paymentId: payment.id,
        quota: plan.saveQuota,
        used: 0,
        validUntil: plan.durationDays ? new Date(Date.now() + plan.durationDays * DAY_IN_MS) : null,
      });
    });
  }
}
