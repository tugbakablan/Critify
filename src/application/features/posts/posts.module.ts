import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../../../domain/features/posts/post.entity';
import { CreatePostHandler } from './commands/create-post/create-post.handler';
import { DeletePostHandler } from './commands/delete-post/delete-post.handler';
import { GetPostListHandler } from './queries/get-post-list/get-post-list.handler';
import { GetPostHandler } from './queries/get-post/get-post.handler';

const CommandHandlers = [CreatePostHandler, DeletePostHandler];
const QueryHandlers = [GetPostHandler, GetPostListHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([PostEntity])],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class PostsModule {}
