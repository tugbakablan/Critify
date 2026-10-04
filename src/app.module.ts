import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  AppConfiguration,
  DatabaseConfiguration,
  JwtConfiguration,
  PaymentConfiguration,
  StorageConfiguration,
} from './domain/settings';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        AppConfiguration,
        DatabaseConfiguration,
        JwtConfiguration,
        StorageConfiguration,
        PaymentConfiguration,
      ],
    }),
    PersistenceModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
