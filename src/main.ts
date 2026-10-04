import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { setupSwagger } from './api/setup/swagger-setup';
import { AppConfig } from './domain/settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Bütün endpoint'ler /api/v1 altında (forphy ile aynı)
  app.setGlobalPrefix('api/v1');
  setupSwagger(app);

  const appConfig = app.get(ConfigService).get<AppConfig>(AppConfig.KEY);
  await app.listen(appConfig.port);
}
bootstrap();
