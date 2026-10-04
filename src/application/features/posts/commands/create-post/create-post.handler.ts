import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../../../../../domain/features/posts/post.entity';
import { PostResponse } from '../../post.response';
import { CreatePostCommand } from './create-post.command';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    @InjectRepository(PostEntity)
    private readonly posts: Repository<PostEntity>,
  ) {}

  async execute(command: CreatePostCommand): Promise<PostResponse> {
    const post = this.posts.create({
      authorId: command.authorId,
      body: command.body.trim(),
    });
    const saved = await this.posts.save(post);

    const withAuthor = await this.posts.findOne({
      where: { id: saved.id },
      relations: { author: true },
    });
    return PostResponse.create(withAuthor);
  }
}
