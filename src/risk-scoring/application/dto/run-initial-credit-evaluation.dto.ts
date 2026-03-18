import type { SimulatedEvaluationOutcome } from '../services/simulated-evaluation.builder';

export interface RunInitialCreditEvaluationInput {
  clientId: string;
  /** 1 = positivo, 2 = negativo; sin definir = aleatorio */
  evaluationOutcome?: SimulatedEvaluationOutcome;
}

export interface RunInitialCreditEvaluationResult {
  evaluationId: string;
  score: number;
  approved: boolean;
  riskLevel: string;
  factors: Record<string, unknown>;
  evaluatedAt: string;
}
