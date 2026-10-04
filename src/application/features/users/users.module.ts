import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../../domain/features/users/user.entity';
import { PasswordHasher } from '../../../infrastructure/security/password-hasher';
import { RegisterUserHandler } from './commands/register-user/register-user.handler';

const CommandHandlers = [RegisterUserHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [...CommandHandlers, PasswordHasher],
})
export class UsersModule {}
