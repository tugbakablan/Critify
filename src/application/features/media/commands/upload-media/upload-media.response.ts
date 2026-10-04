import { ApiProperty } from '@nestjs/swagger';

export class UploadMediaResponse {
  @ApiProperty()
  id: string;

  @ApiProperty({ description: '1 saat geçerli görüntüleme adresi' })
  url: string;

  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  sizeBytes: number;

  static create(id: string, url: string, mimeType: string, sizeBytes: number): UploadMediaResponse {
    const response = new UploadMediaResponse();
    response.id = id;
    response.url = url;
    response.mimeType = mimeType;
    response.sizeBytes = sizeBytes;
    return response;
  }
}
