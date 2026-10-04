import { ApiProperty } from '@nestjs/swagger';
import { CommentEntity } from '../../../domain/features/comments/comment.entity';
import { PostAuthorResponse } from '../posts/post.response';

export class CommentResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  postId: string;

  @ApiProperty()
  body: string;

  @ApiProperty({ type: PostAuthorResponse })
  author: PostAuthorResponse;

  @ApiProperty()
  createdAt: Date;

  static create(comment: CommentEntity): CommentResponse {
    const response = new CommentResponse();
    response.id = comment.id;
    response.postId = comment.postId;
    response.body = comment.body;
    response.author = { id: comment.author.id, displayName: comment.author.displayName };
    response.createdAt = comment.createdAt;
    return response;
  }
}
