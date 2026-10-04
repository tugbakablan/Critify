import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { UsersModule } from '../application/features/users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './controllers/auth.controller';
import { HealthController } from './controllers/health.controller';
import { MeController } from './controllers/me.controller';

@Module({
  imports: [CqrsModule, TerminusModule, AuthModule, UsersModule],
  controllers: [HealthController, AuthController, MeController],
})
export class ApiModule {}
