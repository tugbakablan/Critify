import { ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../../../domain/features/users/user.entity';
import { PasswordHasher } from '../../../../../infrastructure/security/password-hasher';
import { RegisterUserCommand } from './register-user.command';
import { RegisterUserResponse } from './register-user.response';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(command: RegisterUserCommand): Promise<RegisterUserResponse> {
    const email = command.email.trim().toLowerCase();

    const exists = await this.users.existsBy({ email });
    if (exists) {
      throw new ConflictException('Bu e-posta adresiyle kayıtlı bir kullanıcı var.');
    }

    const user = this.users.create({
      email,
      passwordHash: await this.passwordHasher.hash(command.password),
      displayName: command.displayName.trim(),
    });
    const saved = await this.users.save(user);

    return RegisterUserResponse.create(saved);
  }
}
