import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IamModule } from './iam/iam.module';
import { CreditManagementModule } from './credit-management/credit-management.module';
import { PaymentsModule } from './payments/payments.module';
import { RiskScoringModule } from './risk-scoring/risk-scoring.module';
import { CollectionModule } from './collection/collection.module';
import { AuditModule } from './audit/audit.module';
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
        url: process.env.DATABASE_URL,
        entities: typeOrmEntities,
        synchronize: false,
        logging: process.env.NODE_ENV === 'development',
      }),
    }),
    IamModule,
    CreditManagementModule,
    PaymentsModule,
    RiskScoringModule,
    CollectionModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
