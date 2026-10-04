import { ApiProperty } from '@nestjs/swagger';
import { PostResponse } from '../../post.response';

export class GetPostListResponse {
  @ApiProperty({ type: [PostResponse] })
  items: PostResponse[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  static create(items: PostResponse[], page: number, limit: number, total: number): GetPostListResponse {
    const response = new GetPostListResponse();
    response.items = items;
    response.page = page;
    response.limit = limit;
    response.total = total;
    return response;
  }
}
