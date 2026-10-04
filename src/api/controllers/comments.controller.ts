import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AddCommentCommand } from '../../application/features/comments/commands/add-comment/add-comment.command';
import { CommentResponse } from '../../application/features/comments/comment.response';
import { GetCommentListQuery } from '../../application/features/comments/queries/get-comment-list/get-comment-list.query';
import { GetCommentListResponse } from '../../application/features/comments/queries/get-comment-list/get-comment-list.response';
import { AuthenticatedUserModel } from '../../domain/common/models/authenticated-user.model';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationRequestDto } from '../contracts/common/pagination-request.dto';
import { AddCommentRequestDto } from '../contracts/features/comments/add-comment-request.dto';

@ApiTags('Comments')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token yok, geçersiz ya da süresi dolmuş' })
@UseGuards(JwtAuthGuard)
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Paylaşıma yorum yaz' })
  @ApiCreatedResponse({ type: CommentResponse })
  @ApiNotFoundResponse({ description: 'Paylaşım bulunamadı' })
  add(
    @AuthUser() user: AuthenticatedUserModel,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() body: AddCommentRequestDto,
  ): Promise<CommentResponse> {
    return this.commandBus.execute<AddCommentCommand, CommentResponse>(
      new AddCommentCommand(postId, user.id, body.body),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Paylaşımın yorumları (eskiden yeniye)' })
  @ApiOkResponse({ type: GetCommentListResponse })
  @ApiNotFoundResponse({ description: 'Paylaşım bulunamadı' })
  list(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() query: PaginationRequestDto,
  ): Promise<GetCommentListResponse> {
    return this.queryBus.execute<GetCommentListQuery, GetCommentListResponse>(
      new GetCommentListQuery(postId, query.page, query.limit),
    );
  }
}
