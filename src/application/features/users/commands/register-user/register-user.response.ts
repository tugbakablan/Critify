import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../../../../domain/features/users/user.entity';

export class RegisterUserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty()
  createdAt: Date;

  static create(user: UserEntity): RegisterUserResponse {
    const response = new RegisterUserResponse();
    response.id = user.id;
    response.email = user.email;
    response.displayName = user.displayName;
    response.createdAt = user.createdAt;
    return response;
  }
}
