import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanEntity } from '../../../../../domain/features/payments/plan.entity';
import { PlanResponse } from '../../plan.response';
import { GetPlanListQuery } from './get-plan-list.query';

@QueryHandler(GetPlanListQuery)
export class GetPlanListHandler implements IQueryHandler<GetPlanListQuery> {
  constructor(
    @InjectRepository(PlanEntity)
    private readonly plans: Repository<PlanEntity>,
  ) {}

  async execute(): Promise<PlanResponse[]> {
    const plans = await this.plans.find({ order: { priceCents: 'ASC' } });
    return plans.map((plan) => PlanResponse.create(plan));
  }
}
