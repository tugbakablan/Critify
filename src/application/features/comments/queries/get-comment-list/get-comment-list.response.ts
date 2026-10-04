import { ApiProperty } from '@nestjs/swagger';
import { CommentResponse } from '../../comment.response';

export class GetCommentListResponse {
  @ApiProperty({ type: [CommentResponse] })
  items: CommentResponse[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  static create(items: CommentResponse[], page: number, limit: number, total: number): GetCommentListResponse {
    const response = new GetCommentListResponse();
    response.items = items;
    response.page = page;
    response.limit = limit;
    response.total = total;
    return response;
  }
}
