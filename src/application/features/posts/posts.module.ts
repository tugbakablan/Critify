import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from '../../../domain/features/media/media.entity';
import { PostEntity } from '../../../domain/features/posts/post.entity';
import { StorageModule } from '../../../infrastructure/storage/storage.module';
import { CreatePostHandler } from './commands/create-post/create-post.handler';
import { DeletePostHandler } from './commands/delete-post/delete-post.handler';
import { PostResponseFactory } from './post-response.factory';
import { GetPostListHandler } from './queries/get-post-list/get-post-list.handler';
import { GetPostHandler } from './queries/get-post/get-post.handler';

const CommandHandlers = [CreatePostHandler, DeletePostHandler];
const QueryHandlers = [GetPostHandler, GetPostListHandler];

@Module({
  imports: [CqrsModule, StorageModule, TypeOrmModule.forFeature([PostEntity, MediaEntity])],
  providers: [...CommandHandlers, ...QueryHandlers, PostResponseFactory],
  exports: [PostResponseFactory],
})
export class PostsModule {}
