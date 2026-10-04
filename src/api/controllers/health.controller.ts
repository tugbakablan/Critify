import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

/**
 * Uygulama sağlık kontrolleri.
 * forphy karşılığı: src/api/controllers/health.controller.ts
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly typeOrmIndicator: TypeOrmHealthIndicator,
  ) {}

  /** Uygulama ayakta mı? Hiçbir bağımlılığa bakmaz. */
  @Get()
  @ApiOperation({ summary: 'Liveness: uygulama çalışıyor mu?' })
  liveness(): { status: string } {
    return { status: 'ok' };
  }

  /** Uygulama ayakta VE veritabanına ulaşabiliyor mu? */
  @Get('ready')
  @HealthCheck()
  @ApiOperation({ summary: 'Readiness: veritabanı bağlantısı çalışıyor mu?' })
  readiness(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () => this.typeOrmIndicator.pingCheck('database'),
    ]);
  }
}
