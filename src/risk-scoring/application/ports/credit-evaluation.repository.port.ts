import { CreditEvaluation } from '../../domain/entities/credit-evaluation.entity';

export const CREDIT_EVALUATION_REPOSITORY = Symbol(
  'CreditEvaluationRepository',
);

export interface CreditEvaluationRepositoryPort {
  findById(id: string): Promise<CreditEvaluation | null>;
  findByClientId(clientId: string): Promise<CreditEvaluation[]>;
  save(creditEvaluation: CreditEvaluation): Promise<void>;
}
