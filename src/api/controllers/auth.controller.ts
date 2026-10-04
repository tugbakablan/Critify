import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginUserCommand } from '../../application/features/users/commands/login-user/login-user.command';
import { LoginUserResponse } from '../../application/features/users/commands/login-user/login-user.response';
import { RegisterUserCommand } from '../../application/features/users/commands/register-user/register-user.command';
import { RegisterUserResponse } from '../../application/features/users/commands/register-user/register-user.response';
import { LoginRequestDto } from '../contracts/features/auth/login-request.dto';
import { RegisterRequestDto } from '../contracts/features/auth/register-request.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  @ApiOperation({ summary: 'Yeni kullanıcı kaydı' })
  @ApiCreatedResponse({ type: RegisterUserResponse })
  @ApiBadRequestResponse({ description: 'Alanlar kurallara uymuyor' })
  @ApiConflictResponse({ description: 'Bu e-posta zaten kayıtlı' })
  register(@Body() body: RegisterRequestDto): Promise<RegisterUserResponse> {
    return this.commandBus.execute<RegisterUserCommand, RegisterUserResponse>(
      new RegisterUserCommand(body.email, body.password, body.displayName),
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Giriş yap, access token al' })
  @ApiOkResponse({ type: LoginUserResponse })
  @ApiUnauthorizedResponse({ description: 'E-posta veya şifre hatalı' })
  login(@Body() body: LoginRequestDto): Promise<LoginUserResponse> {
    return this.commandBus.execute<LoginUserCommand, LoginUserResponse>(
      new LoginUserCommand(body.email, body.password),
    );
  }
}
