import { Injectable } from '@nestjs/common';
import { CreditScoreHistoryRepositoryPort } from '../../application/ports/credit-score-history.repository.port';

@Injectable()
export class CreditScoreHistoryRepository
  implements CreditScoreHistoryRepositoryPort
{
  async findById(): Promise<null> {
    return null;
  }
  async findByClientId(): Promise<[]> {
    return [];
  }
  async save(): Promise<void> {}
}
