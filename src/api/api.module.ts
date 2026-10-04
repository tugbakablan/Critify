import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { CommentsModule } from '../application/features/comments/comments.module';
import { MediaModule } from '../application/features/media/media.module';
import { PostsModule } from '../application/features/posts/posts.module';
import { UsersModule } from '../application/features/users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './controllers/auth.controller';
import { CommentsController } from './controllers/comments.controller';
import { HealthController } from './controllers/health.controller';
import { MediaController } from './controllers/media.controller';
import { MeController } from './controllers/me.controller';
import { PostsController } from './controllers/posts.controller';

@Module({
  imports: [CqrsModule, TerminusModule, AuthModule, UsersModule, PostsModule, CommentsModule, MediaModule],
  controllers: [HealthController, AuthController, MeController, PostsController, CommentsController, MediaController],
})
export class ApiModule {}
