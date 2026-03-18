import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreditEvaluation } from '../../domain/entities/credit-evaluation.entity';
import { ClientCreditProfile } from '../../domain/entities/client-credit-profile.entity';
import { CreditScoreHistory } from '../../domain/entities/credit-score-history.entity';
import { CLIENT_REPOSITORY } from '../ports/client.repository.port';
import type { ClientRepositoryPort } from '../ports/client.repository.port';
import {
  CREDIT_EVALUATION_REPOSITORY,
  CLIENT_CREDIT_PROFILE_REPOSITORY,
  CREDIT_SCORE_HISTORY_REPOSITORY,
} from '../ports';
import type { CreditEvaluationRepositoryPort } from '../ports/credit-evaluation.repository.port';
import type { ClientCreditProfileRepositoryPort } from '../ports/client-credit-profile.repository.port';
import type { CreditScoreHistoryRepositoryPort } from '../ports/credit-score-history.repository.port';
import { buildSimulatedEvaluation } from '../services/simulated-evaluation.builder';

export interface RunCreditEvaluationCommand {
  clientId: string;
  evaluationOutcome?: 1 | 2;
  evaluatedByUserId: string;
}

@Injectable()
export class RunCreditEvaluationUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY) private readonly clientRepo: ClientRepositoryPort,
    @Inject(CREDIT_EVALUATION_REPOSITORY)
    private readonly evaluationRepo: CreditEvaluationRepositoryPort,
    @Inject(CLIENT_CREDIT_PROFILE_REPOSITORY)
    private readonly profileRepo: ClientCreditProfileRepositoryPort,
    @Inject(CREDIT_SCORE_HISTORY_REPOSITORY)
    private readonly scoreHistoryRepo: CreditScoreHistoryRepositoryPort,
  ) {}

  async execute(cmd: RunCreditEvaluationCommand) {
    const client = await this.clientRepo.findById(cmd.clientId);
    if (!client) {
      throw new NotFoundException('Cliente no encontrado.');
    }

    const sim = buildSimulatedEvaluation(cmd.evaluationOutcome);
    const now = new Date();

    const evaluation = new CreditEvaluation();
    evaluation.clientId = cmd.clientId;
    evaluation.score = sim.score;
    evaluation.approved = sim.approved;
    evaluation.factors = sim.factors;
    evaluation.evaluatedAt = now;
    evaluation.evaluatedByUserId = cmd.evaluatedByUserId;
    await this.evaluationRepo.save(evaluation);

    const existingProfile = await this.profileRepo.findByClientId(cmd.clientId);
    if (existingProfile) {
      existingProfile.currentScore = sim.score;
      existingProfile.riskLevel = sim.riskLevel;
      existingProfile.totalDebt = sim.totalDebt;
      existingProfile.onTimePaymentsCount = sim.onTimePaymentsCount;
      existingProfile.latePaymentsCount = sim.latePaymentsCount;
      await this.profileRepo.save(existingProfile);
    } else {
      const profile = new ClientCreditProfile();
      profile.clientId = cmd.clientId;
      profile.currentScore = sim.score;
      profile.riskLevel = sim.riskLevel;
      profile.totalDebt = sim.totalDebt;
      profile.onTimePaymentsCount = sim.onTimePaymentsCount;
      profile.latePaymentsCount = sim.latePaymentsCount;
      await this.profileRepo.save(profile);
    }

    const history = new CreditScoreHistory();
    history.clientId = cmd.clientId;
    history.score = sim.score;
    history.recordedAt = now;
    await this.scoreHistoryRepo.save(history);

    return {
      evaluationId: evaluation.id,
      score: sim.score,
      approved: sim.approved,
      riskLevel: sim.riskLevel,
      factors: sim.factors,
      evaluatedAt: now.toISOString(),
      evaluatedByUserId: cmd.evaluatedByUserId,
    };
  }
}

