import { ApiProperty } from '@nestjs/swagger';
import { PlanEntity } from '../../../domain/features/payments/plan.entity';

export class PlanResponse {
  @ApiProperty({ example: 'SAVE_PACK_20' })
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ example: 1000, description: 'Kuruş/cent cinsinden' })
  priceCents: number;

  @ApiProperty({ example: 'EUR' })
  currency: string;

  @ApiProperty({ nullable: true, type: Number, description: 'null = sınırsız' })
  saveQuota: number | null;

  @ApiProperty({ nullable: true, type: Number, description: 'null = süresiz' })
  durationDays: number | null;

  static create(plan: PlanEntity): PlanResponse {
    const response = new PlanResponse();
    response.code = plan.code;
    response.name = plan.name;
    response.priceCents = plan.priceCents;
    response.currency = plan.currency;
    response.saveQuota = plan.saveQuota;
    response.durationDays = plan.durationDays;
    return response;
  }
}
