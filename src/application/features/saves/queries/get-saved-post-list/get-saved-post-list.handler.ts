import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedPostEntity } from '../../../../../domain/features/saves/saved-post.entity';
import { PostResponseFactory } from '../../../posts/post-response.factory';
import { GetPostListResponse } from '../../../posts/queries/get-post-list/get-post-list.response';
import { GetSavedPostListQuery } from './get-saved-post-list.query';

@QueryHandler(GetSavedPostListQuery)
export class GetSavedPostListHandler implements IQueryHandler<GetSavedPostListQuery> {
  constructor(
    @InjectRepository(SavedPostEntity)
    private readonly savedPosts: Repository<SavedPostEntity>,
    private readonly responseFactory: PostResponseFactory,
  ) {}

  async execute(query: GetSavedPostListQuery): Promise<GetPostListResponse> {
    const [saved, total] = await this.savedPosts.findAndCount({
      where: { userId: query.userId },
      relations: { post: { author: true, media: true } },
      order: { createdAt: 'DESC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return GetPostListResponse.create(
      await this.responseFactory.createMany(saved.map((item) => item.post)),
      query.page,
      query.limit,
      total,
    );
  }
}
