import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ example: 'tugba@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'GucluSifre123' })
  @IsString()
  @MaxLength(72)
  password: string;
}
