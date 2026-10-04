import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedPostEntity } from '../../../../../domain/features/saves/saved-post.entity';
import { UnsavePostCommand } from './unsave-post.command';

@CommandHandler(UnsavePostCommand)
export class UnsavePostHandler implements ICommandHandler<UnsavePostCommand> {
  constructor(
    @InjectRepository(SavedPostEntity)
    private readonly savedPosts: Repository<SavedPostEntity>,
  ) {}

  async execute(command: UnsavePostCommand): Promise<void> {
    await this.savedPosts.delete({ userId: command.userId, postId: command.postId });
  }
}
