import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitlementEntity } from '../../../domain/features/payments/entitlement.entity';
import { PaymentEntity } from '../../../domain/features/payments/payment.entity';
import { PlanEntity } from '../../../domain/features/payments/plan.entity';
import { MockPaymentProvider } from '../../../infrastructure/payment/mock-payment-provider';
import { WebhookSignature } from '../../../infrastructure/security/webhook-signature';
import { ConfirmMockPaymentHandler } from './commands/confirm-mock-payment/confirm-mock-payment.handler';
import { CreateCheckoutHandler } from './commands/create-checkout/create-checkout.handler';
import { ProcessPaymentWebhookHandler } from './commands/process-payment-webhook/process-payment-webhook.handler';
import { GetMyEntitlementsHandler } from './queries/get-my-entitlements/get-my-entitlements.handler';
import { GetPlanListHandler } from './queries/get-plan-list/get-plan-list.handler';

const CommandHandlers = [CreateCheckoutHandler, ConfirmMockPaymentHandler, ProcessPaymentWebhookHandler];
const QueryHandlers = [GetPlanListHandler, GetMyEntitlementsHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([PlanEntity, PaymentEntity, EntitlementEntity])],
  providers: [...CommandHandlers, ...QueryHandlers, WebhookSignature, MockPaymentProvider],
  exports: [WebhookSignature],
})
export class PaymentsModule {}
