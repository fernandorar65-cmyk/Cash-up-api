import { Module } from '@nestjs/common';
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

@Module({
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
