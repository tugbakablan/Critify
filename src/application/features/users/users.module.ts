import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../../domain/features/users/user.entity';
import { PasswordHasher } from '../../../infrastructure/security/password-hasher';
import { TokenService } from '../../../infrastructure/security/token-service';
import { LoginUserHandler } from './commands/login-user/login-user.handler';
import { RegisterUserHandler } from './commands/register-user/register-user.handler';
import { GetMeHandler } from './queries/get-me/get-me.handler';

const CommandHandlers = [RegisterUserHandler, LoginUserHandler];
const QueryHandlers = [GetMeHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [...CommandHandlers, ...QueryHandlers, PasswordHasher, TokenService],
})
export class UsersModule {}
