import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiPaymentRequiredResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetPostListResponse } from '../../application/features/posts/queries/get-post-list/get-post-list.response';
import { SavePostCommand } from '../../application/features/saves/commands/save-post/save-post.command';
import { SavePostResponse } from '../../application/features/saves/commands/save-post/save-post.response';
import { UnsavePostCommand } from '../../application/features/saves/commands/unsave-post/unsave-post.command';
import { GetSavedPostListQuery } from '../../application/features/saves/queries/get-saved-post-list/get-saved-post-list.query';
import { AuthenticatedUserModel } from '../../domain/common/models/authenticated-user.model';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationRequestDto } from '../contracts/common/pagination-request.dto';

@ApiTags('Saves')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token yok, geçersiz ya da süresi dolmuş' })
@UseGuards(JwtAuthGuard)
@Controller()
export class SavesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('posts/:postId/save')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Paylaşımı kaydet (paket gerekir)' })
  @ApiOkResponse({ type: SavePostResponse })
  @ApiPaymentRequiredResponse({ description: 'Kullanılabilir paket yok' })
  @ApiNotFoundResponse({ description: 'Paylaşım bulunamadı' })
  save(
    @AuthUser() user: AuthenticatedUserModel,
    @Param('postId', ParseUUIDPipe) postId: string,
  ): Promise<SavePostResponse> {
    return this.commandBus.execute<SavePostCommand, SavePostResponse>(
      new SavePostCommand(user.id, postId),
    );
  }

  @Delete('posts/:postId/save')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Kaydı kaldır (hak iade edilmez)' })
  @ApiNoContentResponse()
  unsave(
    @AuthUser() user: AuthenticatedUserModel,
    @Param('postId', ParseUUIDPipe) postId: string,
  ): Promise<void> {
    return this.commandBus.execute<UnsavePostCommand, void>(new UnsavePostCommand(user.id, postId));
  }

  @Get('me/saved-posts')
  @ApiOperation({ summary: 'Kaydettiğim paylaşımlar (en son kaydedilen önce)' })
  @ApiOkResponse({ type: GetPostListResponse })
  list(
    @AuthUser() user: AuthenticatedUserModel,
    @Query() query: PaginationRequestDto,
  ): Promise<GetPostListResponse> {
    return this.queryBus.execute<GetSavedPostListQuery, GetPostListResponse>(
      new GetSavedPostListQuery(user.id, query.page, query.limit),
    );
  }
}
