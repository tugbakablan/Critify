import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * API dokümanını http://localhost:<port>/docs adresinde yayınlar.
 * forphy karşılığı: src/api/setup/swagger-setup.ts
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Critify API')
    .setDescription('Paylaşım, yorum ve paketli kaydetme')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}
