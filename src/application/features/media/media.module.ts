import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from '../../../domain/features/media/media.entity';
import { StorageModule } from '../../../infrastructure/storage/storage.module';
import { UploadMediaHandler } from './commands/upload-media/upload-media.handler';

@Module({
  imports: [CqrsModule, StorageModule, TypeOrmModule.forFeature([MediaEntity])],
  providers: [UploadMediaHandler],
})
export class MediaModule {}
