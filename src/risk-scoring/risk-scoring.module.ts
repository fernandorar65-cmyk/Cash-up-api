import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './domain/entities/client.entity';
import { CreditEvaluation } from './domain/entities/credit-evaluation.entity';
import { CreditScoreHistory } from './domain/entities/credit-score-history.entity';
import { ClientBackgroundCheck } from './domain/entities/client-background-check.entity';
import { ExternalDebt } from './domain/entities/external-debt.entity';
import { ClientCreditProfile } from './domain/entities/client-credit-profile.entity';
import {
  CLIENT_REPOSITORY,
  CREDIT_EVALUATION_REPOSITORY,
  CREDIT_SCORE_HISTORY_REPOSITORY,
  CLIENT_BACKGROUND_CHECK_REPOSITORY,
  EXTERNAL_DEBT_REPOSITORY,
  CLIENT_CREDIT_PROFILE_REPOSITORY,
} from './application/ports';
import { ClientRepository } from './infrastructure/persistence/client.repository';
import { CreditEvaluationRepository } from './infrastructure/persistence/credit-evaluation.repository';
import { CreditScoreHistoryRepository } from './infrastructure/persistence/credit-score-history.repository';
import { ClientBackgroundCheckRepository } from './infrastructure/persistence/client-background-check.repository';
import { ExternalDebtRepository } from './infrastructure/persistence/external-debt.repository';
import { ClientCreditProfileRepository } from './infrastructure/persistence/client-credit-profile.repository';
import { GetClientUseCase } from './application/use-cases/get-client.use-case';
import { GetClientCreditProfileUseCase } from './application/use-cases/get-client-credit-profile.use-case';
import { ClientsController } from './presentation/clients.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Client,
      CreditEvaluation,
      CreditScoreHistory,
      ClientBackgroundCheck,
      ExternalDebt,
      ClientCreditProfile,
    ]),
  ],
  controllers: [ClientsController],
  providers: [
    { provide: CLIENT_REPOSITORY, useClass: ClientRepository },
    {
      provide: CREDIT_EVALUATION_REPOSITORY,
      useClass: CreditEvaluationRepository,
    },
    {
      provide: CREDIT_SCORE_HISTORY_REPOSITORY,
      useClass: CreditScoreHistoryRepository,
    },
    {
      provide: CLIENT_BACKGROUND_CHECK_REPOSITORY,
      useClass: ClientBackgroundCheckRepository,
    },
    { provide: EXTERNAL_DEBT_REPOSITORY, useClass: ExternalDebtRepository },
    {
      provide: CLIENT_CREDIT_PROFILE_REPOSITORY,
      useClass: ClientCreditProfileRepository,
    },
    GetClientUseCase,
    GetClientCreditProfileUseCase,
  ],
  exports: [
    CLIENT_REPOSITORY,
    CREDIT_EVALUATION_REPOSITORY,
    CREDIT_SCORE_HISTORY_REPOSITORY,
    CLIENT_BACKGROUND_CHECK_REPOSITORY,
    EXTERNAL_DEBT_REPOSITORY,
    CLIENT_CREDIT_PROFILE_REPOSITORY,
  ],
})
export class RiskScoringModule {}
