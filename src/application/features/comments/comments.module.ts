import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from '../../../domain/features/comments/comment.entity';
import { PostEntity } from '../../../domain/features/posts/post.entity';
import { AddCommentHandler } from './commands/add-comment/add-comment.handler';
import { GetCommentListHandler } from './queries/get-comment-list/get-comment-list.handler';

const CommandHandlers = [AddCommentHandler];
const QueryHandlers = [GetCommentListHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([CommentEntity, PostEntity])],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class CommentsModule {}
