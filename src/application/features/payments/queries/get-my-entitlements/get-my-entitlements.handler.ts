import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntitlementEntity } from '../../../../../domain/features/payments/entitlement.entity';
import { EntitlementResponse } from './entitlement.response';
import { GetMyEntitlementsQuery } from './get-my-entitlements.query';

@QueryHandler(GetMyEntitlementsQuery)
export class GetMyEntitlementsHandler implements IQueryHandler<GetMyEntitlementsQuery> {
  constructor(
    @InjectRepository(EntitlementEntity)
    private readonly entitlements: Repository<EntitlementEntity>,
  ) {}

  async execute(query: GetMyEntitlementsQuery): Promise<EntitlementResponse[]> {
    const entitlements = await this.entitlements.find({
      where: { userId: query.userId },
      relations: { plan: true },
      order: { createdAt: 'ASC' },
    });
    const now = new Date();
    return entitlements
      .filter((entitlement) => entitlement.isUsable(now))
      .map((entitlement) => EntitlementResponse.create(entitlement));
  }
}
