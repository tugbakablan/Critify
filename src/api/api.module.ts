import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { UsersModule } from '../application/features/users/users.module';
import { AuthController } from './controllers/auth.controller';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [CqrsModule, TerminusModule, UsersModule],
  controllers: [HealthController, AuthController],
})
export class ApiModule {}
