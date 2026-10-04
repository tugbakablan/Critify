import { ApiProperty } from '@nestjs/swagger';

export class SavePostResponse {
  @ApiProperty()
  postId: string;

  @ApiProperty({ description: 'Daha önce kaydedilmişse true; bu durumda hak tüketilmez' })
  alreadySaved: boolean;

  @ApiProperty({ nullable: true, type: Number, description: 'Kalan kayıt hakkı · null = sınırsız' })
  remaining: number | null;

  static create(postId: string, alreadySaved: boolean, remaining: number | null): SavePostResponse {
    const response = new SavePostResponse();
    response.postId = postId;
    response.alreadySaved = alreadySaved;
    response.remaining = remaining;
    return response;
  }
}
