import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlanResponse } from '../../application/features/payments/plan.response';
import { GetPlanListQuery } from '../../application/features/payments/queries/get-plan-list/get-plan-list.query';

@ApiTags('Plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'Satın alınabilir paketler (giriş gerekmez)' })
  @ApiOkResponse({ type: [PlanResponse] })
  list(): Promise<PlanResponse[]> {
    return this.queryBus.execute<GetPlanListQuery, PlanResponse[]>(new GetPlanListQuery());
  }
}
