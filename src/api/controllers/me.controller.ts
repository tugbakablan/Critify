import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
}
