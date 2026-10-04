import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class CreateCheckoutRequestDto {
  @ApiProperty({ example: 'SAVE_PACK_20', enum: ['SAVE_PACK_20', 'PRO_30'] })
  @IsIn(['SAVE_PACK_20', 'PRO_30'])
  planCode: string;
}
