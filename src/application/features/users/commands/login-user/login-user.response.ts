import { ApiProperty } from '@nestjs/swagger';

export class LoginUserResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType: string;

  @ApiProperty({ example: '1h' })
  expiresIn: string;

  static create(accessToken: string, expiresIn: string): LoginUserResponse {
    const response = new LoginUserResponse();
    response.accessToken = accessToken;
    response.tokenType = 'Bearer';
    response.expiresIn = expiresIn;
    return response;
  }
}
