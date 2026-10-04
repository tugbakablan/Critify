import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../../../../domain/features/users/user.entity';

export class GetMeResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty()
  createdAt: Date;

  static create(user: UserEntity): GetMeResponse {
    const response = new GetMeResponse();
    response.id = user.id;
    response.email = user.email;
    response.displayName = user.displayName;
    response.createdAt = user.createdAt;
    return response;
  }
}
