import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../../../domain/features/users/user.entity';
import { PasswordHasher } from '../../../../../infrastructure/security/password-hasher';
import { TokenService } from '../../../../../infrastructure/security/token-service';
import { LoginUserCommand } from './login-user.command';
import { LoginUserResponse } from './login-user.response';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: LoginUserCommand): Promise<LoginUserResponse> {
    const email = command.email.trim().toLowerCase();
    const user = await this.users.findOneBy({ email });

    const passwordMatches = user
      ? await this.passwordHasher.verify(command.password, user.passwordHash)
      : false;

    if (!passwordMatches) {
      throw new UnauthorizedException('E-posta veya şifre hatalı.');
    }

    const { accessToken, expiresIn } = this.tokenService.createAccessToken(user.id, user.email);
    return LoginUserResponse.create(accessToken, expiresIn);
  }
}
