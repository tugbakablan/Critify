import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedPostEntity } from '../../../domain/features/saves/saved-post.entity';
import { PostsModule } from '../posts/posts.module';
import { SavePostHandler } from './commands/save-post/save-post.handler';
import { UnsavePostHandler } from './commands/unsave-post/unsave-post.handler';
import { GetSavedPostListHandler } from './queries/get-saved-post-list/get-saved-post-list.handler';

const CommandHandlers = [SavePostHandler, UnsavePostHandler];
const QueryHandlers = [GetSavedPostListHandler];

@Module({
  imports: [CqrsModule, PostsModule, TypeOrmModule.forFeature([SavedPostEntity])],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class SavesModule {}
