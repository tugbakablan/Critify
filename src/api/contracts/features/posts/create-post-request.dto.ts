import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreatePostRequestDto {
  @ApiPropertyOptional({ example: 'Bugün ilk paylaşımımı yapıyorum!', maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  body?: string;

  @ApiPropertyOptional({ description: 'POST /media cevabındaki id' })
  @IsOptional()
  @IsUUID()
  mediaId?: string;
}
