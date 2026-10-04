import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { CommentEntity } from '../../../../../domain/features/comments/comment.entity';
import { PostEntity } from '../../../../../domain/features/posts/post.entity';
import { CommentResponse } from '../../comment.response';
import { AddCommentCommand } from './add-comment.command';

@CommandHandler(AddCommentCommand)
export class AddCommentHandler implements ICommandHandler<AddCommentCommand> {
  constructor(private readonly dataSource: DataSource) {}

  async execute(command: AddCommentCommand): Promise<CommentResponse> {
    const commentId = await this.dataSource.transaction(async (manager) => {
      const postExists = await manager.existsBy(PostEntity, { id: command.postId });
      if (!postExists) {
        throw new NotFoundException('Paylaşım bulunamadı.');
      }

      const comment = manager.create(CommentEntity, {
        postId: command.postId,
        authorId: command.authorId,
        body: command.body.trim(),
      });
      const saved = await manager.save(comment);

      await manager.increment(PostEntity, { id: command.postId }, 'commentCount', 1);

      return saved.id;
    });

    const comment = await this.dataSource.getRepository(CommentEntity).findOne({
      where: { id: commentId },
      relations: { author: true },
    });
    return CommentResponse.create(comment);
  }
}
