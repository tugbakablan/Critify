import { ApiProperty } from '@nestjs/swagger';
import { PostEntity } from '../../../domain/features/posts/post.entity';

export class PostAuthorResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  displayName: string;
}

export class PostResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  body: string;

  @ApiProperty({ type: PostAuthorResponse })
  author: PostAuthorResponse;

  @ApiProperty()
  commentCount: number;

  @ApiProperty()
  createdAt: Date;

  static create(post: PostEntity): PostResponse {
    const response = new PostResponse();
    response.id = post.id;
    response.body = post.body;
    response.author = { id: post.author.id, displayName: post.author.displayName };
    response.commentCount = post.commentCount;
    response.createdAt = post.createdAt;
    return response;
  }
}
