import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamModule } from '../iam/iam.module';

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
import { CreateClientUseCase } from './application/use-cases/create-client.use-case';
import { RunInitialCreditEvaluationUseCase } from './application/use-cases/run-initial-credit-evaluation.use-case';
import { GetMyClientUseCase } from './application/use-cases/get-my-client.use-case';
import { UpdateMyClientUseCase } from './application/use-cases/update-my-client.use-case';
import { ListClientEvaluationsUseCase } from './application/use-cases/list-client-evaluations.use-case';
import { RunCreditEvaluationUseCase } from './application/use-cases/run-credit-evaluation.use-case';

import { ClientsController } from './presentation/clients.controller';

@Module({
  imports: [
    IamModule,
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
    CreateClientUseCase,
    RunInitialCreditEvaluationUseCase,
    GetMyClientUseCase,
    UpdateMyClientUseCase,
    ListClientEvaluationsUseCase,
    RunCreditEvaluationUseCase,
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

