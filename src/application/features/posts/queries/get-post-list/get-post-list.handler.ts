import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../../../../../domain/features/posts/post.entity';
import { PostResponseFactory } from '../../post-response.factory';
import { GetPostListQuery } from './get-post-list.query';
import { GetPostListResponse } from './get-post-list.response';

@QueryHandler(GetPostListQuery)
export class GetPostListHandler implements IQueryHandler<GetPostListQuery> {
  constructor(
    @InjectRepository(PostEntity)
    private readonly posts: Repository<PostEntity>,
    private readonly responseFactory: PostResponseFactory,
  ) {}

  async execute(query: GetPostListQuery): Promise<GetPostListResponse> {
    const [posts, total] = await this.posts.findAndCount({
      relations: { author: true, media: true },
      order: { createdAt: 'DESC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return GetPostListResponse.create(
      await this.responseFactory.createMany(posts),
      query.page,
      query.limit,
      total,
    );
  }
}
