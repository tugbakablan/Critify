import { ApiProperty } from '@nestjs/swagger';
import { EntitlementEntity } from '../../../../../domain/features/payments/entitlement.entity';

export class EntitlementResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  planName: string;

  @ApiProperty()
  unlimited: boolean;

  @ApiProperty({ nullable: true, type: Number })
  remaining: number | null;

  @ApiProperty()
  used: number;

  @ApiProperty({ nullable: true, type: Date })
  validUntil: Date | null;

  static create(entitlement: EntitlementEntity): EntitlementResponse {
    const response = new EntitlementResponse();
    response.id = entitlement.id;
    response.planName = entitlement.plan.name;
    response.unlimited = entitlement.isUnlimited;
    response.remaining = entitlement.remaining;
    response.used = entitlement.used;
    response.validUntil = entitlement.validUntil;
    return response;
  }
}
