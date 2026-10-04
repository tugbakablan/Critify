import { BadRequestException, ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaEntity } from '../../../../../domain/features/media/media.entity';
import { PostEntity } from '../../../../../domain/features/posts/post.entity';
import { PostResponseFactory } from '../../post-response.factory';
import { PostResponse } from '../../post.response';
import { CreatePostCommand } from './create-post.command';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    @InjectRepository(PostEntity)
    private readonly posts: Repository<PostEntity>,
    @InjectRepository(MediaEntity)
    private readonly media: Repository<MediaEntity>,
    private readonly responseFactory: PostResponseFactory,
  ) {}

  async execute(command: CreatePostCommand): Promise<PostResponse> {
    const body = (command.body ?? '').trim();
    if (!body && !command.mediaId) {
      throw new BadRequestException('Paylaşımda metin ya da fotoğraf olmalı.');
    }

    if (command.mediaId) {
      const media = await this.media.findOneBy({ id: command.mediaId });
      if (!media || media.ownerId !== command.authorId) {
        throw new BadRequestException('Fotoğraf bulunamadı.');
      }
      const alreadyUsed = await this.posts.existsBy({ mediaId: command.mediaId });
      if (alreadyUsed) {
        throw new ConflictException('Bu fotoğraf başka bir paylaşımda kullanılıyor.');
      }
    }

    const saved = await this.posts.save(
      this.posts.create({
        authorId: command.authorId,
        body,
        mediaId: command.mediaId ?? null,
      }),
    );

    const post = await this.posts.findOne({
      where: { id: saved.id },
      relations: { author: true, media: true },
    });
    return this.responseFactory.create(post);
  }
}
