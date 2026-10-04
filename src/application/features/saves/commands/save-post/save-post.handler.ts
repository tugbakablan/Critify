import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { EntitlementEntity } from '../../../../../domain/features/payments/entitlement.entity';
import { PostEntity } from '../../../../../domain/features/posts/post.entity';
import { SavedPostEntity } from '../../../../../domain/features/saves/saved-post.entity';
import { SavePostCommand } from './save-post.command';
import { SavePostResponse } from './save-post.response';

@CommandHandler(SavePostCommand)
export class SavePostHandler implements ICommandHandler<SavePostCommand> {
  constructor(private readonly dataSource: DataSource) {}

  execute(command: SavePostCommand): Promise<SavePostResponse> {
    return this.dataSource.transaction(async (manager) => {
      const postExists = await manager.existsBy(PostEntity, { id: command.postId });
      if (!postExists) {
        throw new NotFoundException('Paylaşım bulunamadı.');
      }

      const alreadySaved = await manager.existsBy(SavedPostEntity, {
        userId: command.userId,
        postId: command.postId,
      });
      if (alreadySaved) {
        return SavePostResponse.create(command.postId, true, null);
      }

      const entitlements = await manager.find(EntitlementEntity, {
        where: { userId: command.userId },
        order: { createdAt: 'ASC' },
        lock: { mode: 'pessimistic_write' },
      });
      const now = new Date();
      const usable = entitlements.filter((entitlement) => entitlement.isUsable(now));
      const entitlement = usable.find((candidate) => candidate.isUnlimited) ?? usable[0];

      if (!entitlement) {
        throw new HttpException('Kaydetmek için bir paket gerekiyor.', HttpStatus.PAYMENT_REQUIRED);
      }

      if (!entitlement.isUnlimited) {
        entitlement.used += 1;
        await manager.save(entitlement);
      }

      await manager.insert(SavedPostEntity, {
        userId: command.userId,
        postId: command.postId,
        entitlementId: entitlement.id,
      });

      return SavePostResponse.create(command.postId, false, entitlement.remaining);
    });
  }
}
