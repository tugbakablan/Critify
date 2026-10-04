import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../../../../../domain/features/posts/post.entity';
import { DeletePostCommand } from './delete-post.command';

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(
    @InjectRepository(PostEntity)
    private readonly posts: Repository<PostEntity>,
  ) {}

  async execute(command: DeletePostCommand): Promise<void> {
    const post = await this.posts.findOneBy({ id: command.postId });
    if (!post) {
      throw new NotFoundException('Paylaşım bulunamadı.');
    }
    if (post.authorId !== command.userId) {
      throw new ForbiddenException('Bu paylaşımı yalnızca sahibi silebilir.');
    }
    await this.posts.delete({ id: post.id });
  }
}
