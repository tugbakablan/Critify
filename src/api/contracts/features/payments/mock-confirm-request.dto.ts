import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class MockConfirmRequestDto {
  @ApiProperty({ example: 'success', enum: ['success', 'fail'] })
  @IsIn(['success', 'fail'])
  outcome: 'success' | 'fail';
}
