import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../../../../../domain/features/posts/post.entity';
import { PostResponseFactory } from '../../post-response.factory';
import { PostResponse } from '../../post.response';
import { GetPostQuery } from './get-post.query';

@QueryHandler(GetPostQuery)
export class GetPostHandler implements IQueryHandler<GetPostQuery> {
  constructor(
    @InjectRepository(PostEntity)
    private readonly posts: Repository<PostEntity>,
    private readonly responseFactory: PostResponseFactory,
  ) {}

  async execute(query: GetPostQuery): Promise<PostResponse> {
    const post = await this.posts.findOne({
      where: { id: query.postId },
      relations: { author: true, media: true },
    });
    if (!post) {
      throw new NotFoundException('Paylaşım bulunamadı.');
    }
    return this.responseFactory.create(post);
  }
}
