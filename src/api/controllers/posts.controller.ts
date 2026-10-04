import {
  Body,
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
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreatePostCommand } from '../../application/features/posts/commands/create-post/create-post.command';
import { DeletePostCommand } from '../../application/features/posts/commands/delete-post/delete-post.command';
import { PostResponse } from '../../application/features/posts/post.response';
import { GetPostListQuery } from '../../application/features/posts/queries/get-post-list/get-post-list.query';
import { GetPostListResponse } from '../../application/features/posts/queries/get-post-list/get-post-list.response';
import { GetPostQuery } from '../../application/features/posts/queries/get-post/get-post.query';
import { AuthenticatedUserModel } from '../../domain/common/models/authenticated-user.model';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePostRequestDto } from '../contracts/features/posts/create-post-request.dto';
import { PaginationRequestDto } from '../contracts/common/pagination-request.dto';

@ApiTags('Posts')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token yok, geçersiz ya da süresi dolmuş' })
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Yeni paylaşım (metin, fotoğraf ya da ikisi)' })
  @ApiCreatedResponse({ type: PostResponse })
  create(
    @AuthUser() user: AuthenticatedUserModel,
    @Body() body: CreatePostRequestDto,
  ): Promise<PostResponse> {
    return this.commandBus.execute<CreatePostCommand, PostResponse>(
      new CreatePostCommand(user.id, body.body, body.mediaId),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Akış: en yeni paylaşımlar, sayfa sayfa' })
  @ApiOkResponse({ type: GetPostListResponse })
  list(@Query() query: PaginationRequestDto): Promise<GetPostListResponse> {
    return this.queryBus.execute<GetPostListQuery, GetPostListResponse>(
      new GetPostListQuery(query.page, query.limit),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Tek paylaşım' })
  @ApiOkResponse({ type: PostResponse })
  @ApiNotFoundResponse({ description: 'Paylaşım bulunamadı' })
  getOne(@Param('id', ParseUUIDPipe) id: string): Promise<PostResponse> {
    return this.queryBus.execute<GetPostQuery, PostResponse>(new GetPostQuery(id));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Paylaşımı sil (yalnızca sahibi)' })
  @ApiNoContentResponse({ description: 'Silindi' })
  @ApiForbiddenResponse({ description: 'Paylaşım başkasına ait' })
  @ApiNotFoundResponse({ description: 'Paylaşım bulunamadı' })
  remove(
    @AuthUser() user: AuthenticatedUserModel,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.commandBus.execute<DeletePostCommand, void>(new DeletePostCommand(id, user.id));
  }
}
