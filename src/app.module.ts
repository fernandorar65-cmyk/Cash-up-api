import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IamModule } from './iam/iam.module';
import { CreditManagementModule } from './credit-management/credit-management.module';
import { PaymentsModule } from './payments/payments.module';
import { RiskScoringModule } from './risk-scoring/risk-scoring.module';
import { CollectionModule } from './collection/collection.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
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
