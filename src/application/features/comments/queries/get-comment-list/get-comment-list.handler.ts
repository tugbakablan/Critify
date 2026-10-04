import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from '../../../../../domain/features/comments/comment.entity';
import { PostEntity } from '../../../../../domain/features/posts/post.entity';
import { CommentResponse } from '../../comment.response';
import { GetCommentListQuery } from './get-comment-list.query';
import { GetCommentListResponse } from './get-comment-list.response';

@QueryHandler(GetCommentListQuery)
export class GetCommentListHandler implements IQueryHandler<GetCommentListQuery> {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly comments: Repository<CommentEntity>,
    @InjectRepository(PostEntity)
    private readonly posts: Repository<PostEntity>,
  ) {}

  async execute(query: GetCommentListQuery): Promise<GetCommentListResponse> {
    const postExists = await this.posts.existsBy({ id: query.postId });
    if (!postExists) {
      throw new NotFoundException('Paylaşım bulunamadı.');
    }

    const [comments, total] = await this.comments.findAndCount({
      where: { postId: query.postId },
      relations: { author: true },
      order: { createdAt: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return GetCommentListResponse.create(
      comments.map((comment) => CommentResponse.create(comment)),
      query.page,
      query.limit,
      total,
    );
  }
}
