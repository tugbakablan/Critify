import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterUserCommand } from '../../application/features/users/commands/register-user/register-user.command';
import { RegisterUserResponse } from '../../application/features/users/commands/register-user/register-user.response';
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
}
