import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { MediaEntity } from '../../../../../domain/features/media/media.entity';
import { StorageService } from '../../../../../infrastructure/storage/storage.service';
import { UploadMediaCommand } from './upload-media.command';
import { UploadMediaResponse } from './upload-media.response';

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

@CommandHandler(UploadMediaCommand)
export class UploadMediaHandler implements ICommandHandler<UploadMediaCommand> {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly media: Repository<MediaEntity>,
    private readonly storage: StorageService,
  ) {}

  async execute(command: UploadMediaCommand): Promise<UploadMediaResponse> {
    const extension = EXTENSIONS[command.mimeType];
    const objectKey = `posts/${command.ownerId}/${randomUUID()}.${extension}`;

    await this.storage.upload(objectKey, command.content, command.mimeType);

    const saved = await this.media.save(
      this.media.create({
        ownerId: command.ownerId,
        objectKey,
        mimeType: command.mimeType,
        sizeBytes: command.content.length,
      }),
    );

    const url = await this.storage.getPresignedUrl(objectKey);
    return UploadMediaResponse.create(saved.id, url, saved.mimeType, saved.sizeBytes);
  }
}
