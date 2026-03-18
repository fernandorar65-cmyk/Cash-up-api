import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
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
import type {
  RunInitialCreditEvaluationInput,
  RunInitialCreditEvaluationResult,
} from '../dto/run-initial-credit-evaluation.dto';

/**
 * Primera evaluación simulada para un cliente recién creado.
 * No debe ejecutarse dos veces para el mismo cliente.
 */
@Injectable()
export class RunInitialCreditEvaluationUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY) private readonly clientRepo: ClientRepositoryPort,
    @Inject(CREDIT_EVALUATION_REPOSITORY)
    private readonly evaluationRepo: CreditEvaluationRepositoryPort,
    @Inject(CLIENT_CREDIT_PROFILE_REPOSITORY)
    private readonly profileRepo: ClientCreditProfileRepositoryPort,
    @Inject(CREDIT_SCORE_HISTORY_REPOSITORY)
    private readonly scoreHistoryRepo: CreditScoreHistoryRepositoryPort,
  ) {}

  async execute(
    input: RunInitialCreditEvaluationInput,
  ): Promise<RunInitialCreditEvaluationResult> {
    const client = await this.clientRepo.findById(input.clientId);
    if (!client) {
      throw new NotFoundException('Cliente no encontrado.');
    }

    const existingProfile = await this.profileRepo.findByClientId(
      input.clientId,
    );
    if (existingProfile) {
      throw new ConflictException(
        'Este cliente ya tiene evaluación inicial y perfil de crédito.',
      );
    }

    const sim = buildSimulatedEvaluation(input.evaluationOutcome);
    const now = new Date();

    const evaluation = new CreditEvaluation();
    evaluation.clientId = input.clientId;
    evaluation.score = sim.score;
    evaluation.approved = sim.approved;
    evaluation.factors = sim.factors;
    evaluation.evaluatedAt = now;
    evaluation.evaluatedByUserId = null;
    await this.evaluationRepo.save(evaluation);

    const profile = new ClientCreditProfile();
    profile.clientId = input.clientId;
    profile.currentScore = sim.score;
    profile.riskLevel = sim.riskLevel;
    profile.totalDebt = sim.totalDebt;
    profile.onTimePaymentsCount = sim.onTimePaymentsCount;
    profile.latePaymentsCount = sim.latePaymentsCount;
    await this.profileRepo.save(profile);

    const history = new CreditScoreHistory();
    history.clientId = input.clientId;
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
    };
  }
}
