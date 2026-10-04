import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly typeOrmIndicator: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Liveness: uygulama çalışıyor mu?' })
  liveness(): { status: string } {
    return { status: 'ok' };
  }

  @Get('ready')
  @HealthCheck()
  @ApiOperation({ summary: 'Readiness: veritabanı bağlantısı çalışıyor mu?' })
  readiness(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () => this.typeOrmIndicator.pingCheck('database'),
    ]);
  }
}
