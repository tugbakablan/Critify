import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';

/** Dışarıya açılan bütün controller'lar burada kaydedilir. */
@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export class ApiModule {}
