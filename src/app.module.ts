import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IamModule } from './modules/iam/iam.module';
import { JwtAuthGuard } from './modules/iam/presentation/guards/jwt-auth.guard';
import { CreditManagementModule } from './modules/credit-management/credit-management.module';
import { RiskScoringModule } from './modules/risk-scoring/risk-scoring.module';
import configuration from './config/configuration';
import { typeOrmEntities } from './entities-index';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: "postgresql://postgres:postgres@localhost:5432/cashup",
        entities: typeOrmEntities,
        synchronize: false,
      }),
    }),
    IamModule,
    CreditManagementModule,
    RiskScoringModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
