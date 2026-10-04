import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../../../../../domain/features/payments/payment.entity';
import { PaymentStatus } from '../../../../../domain/features/payments/payment-status';
import { PlanEntity } from '../../../../../domain/features/payments/plan.entity';
import { PaymentResponse } from '../../payment.response';
import { CreateCheckoutCommand } from './create-checkout.command';
import { CreateCheckoutResponse } from './create-checkout.response';

@CommandHandler(CreateCheckoutCommand)
export class CreateCheckoutHandler implements ICommandHandler<CreateCheckoutCommand> {
  constructor(
    @InjectRepository(PlanEntity)
    private readonly plans: Repository<PlanEntity>,
    @InjectRepository(PaymentEntity)
    private readonly payments: Repository<PaymentEntity>,
  ) {}

  async execute(command: CreateCheckoutCommand): Promise<CreateCheckoutResponse> {
    const plan = await this.plans.findOneBy({ code: command.planCode });
    if (!plan) {
      throw new NotFoundException('Paket bulunamadı.');
    }

    const payment = await this.payments.save(
      this.payments.create({
        userId: command.userId,
        planId: plan.id,
        amountCents: plan.priceCents,
        currency: plan.currency,
        status: PaymentStatus.PENDING,
      }),
    );
    payment.plan = plan;

    return CreateCheckoutResponse.create(PaymentResponse.create(payment));
  }
}
