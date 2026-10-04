import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { EntitlementResponse } from '../../application/features/payments/queries/get-my-entitlements/entitlement.response';
import { GetMyEntitlementsQuery } from '../../application/features/payments/queries/get-my-entitlements/get-my-entitlements.query';
import { GetMeQuery } from '../../application/features/users/queries/get-me/get-me.query';
import { GetMeResponse } from '../../application/features/users/queries/get-me/get-me.response';
import { AuthenticatedUserModel } from '../../domain/common/models/authenticated-user.model';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Me')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('me')
export class MeController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'Giriş yapmış kullanıcının bilgileri' })
  @ApiOkResponse({ type: GetMeResponse })
  @ApiUnauthorizedResponse({ description: 'Token yok, geçersiz ya da süresi dolmuş' })
  getMe(@AuthUser() user: AuthenticatedUserModel): Promise<GetMeResponse> {
    return this.queryBus.execute<GetMeQuery, GetMeResponse>(new GetMeQuery(user.id));
  }

  @Get('entitlements')
  @ApiOperation({ summary: 'Kullanılabilir kayıt haklarım' })
  @ApiOkResponse({ type: [EntitlementResponse] })
  getEntitlements(@AuthUser() user: AuthenticatedUserModel): Promise<EntitlementResponse[]> {
    return this.queryBus.execute<GetMyEntitlementsQuery, EntitlementResponse[]>(
      new GetMyEntitlementsQuery(user.id),
    );
  }
}
