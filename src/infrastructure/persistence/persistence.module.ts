import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseConfig } from '../../domain/settings';

/**
 * Veritabanı bağlantısı. Bağlantı bilgileri DatabaseConfig'ten (.env → DB_*) gelir.
 * forphy karşılığı: src/infrastructure/persistence/persistence.module.ts
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const db = configService.get<DatabaseConfig>(DatabaseConfig.KEY);

        return {
          type: 'postgres',
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.database,
          // Entity'ler (tablolar) Faz 1'de gelecek. forFeature ile kaydedilenler otomatik eklenir.
          autoLoadEntities: true,
          // Şema asla otomatik değişmez; değişiklikler migration ile yapılır (forphy ile aynı).
          synchronize: false,
        };
      },
    }),
  ],
})
export class PersistenceModule {}
