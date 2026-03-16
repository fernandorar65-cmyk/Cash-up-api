import { CreditScoreHistory } from '../../domain/entities/credit-score-history.entity';

export const CREDIT_SCORE_HISTORY_REPOSITORY = Symbol(
  'CreditScoreHistoryRepository',
);

export interface CreditScoreHistoryRepositoryPort {
  findById(id: string): Promise<CreditScoreHistory | null>;
  findByClientId(clientId: string): Promise<CreditScoreHistory[]>;
  save(creditScoreHistory: CreditScoreHistory): Promise<void>;
}
