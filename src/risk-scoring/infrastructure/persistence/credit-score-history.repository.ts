import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditScoreHistory } from '../../domain/entities/credit-score-history.entity';
import type { CreditScoreHistoryRepositoryPort } from '../../application/ports/credit-score-history.repository.port';

@Injectable()
export class CreditScoreHistoryRepository
  implements CreditScoreHistoryRepositoryPort
{
  constructor(
    @InjectRepository(CreditScoreHistory)
    private readonly repo: Repository<CreditScoreHistory>,
  ) {}

  async findById(id: string): Promise<CreditScoreHistory | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByClientId(clientId: string): Promise<CreditScoreHistory[]> {
    return this.repo.find({
      where: { clientId },
      order: { recordedAt: 'DESC' },
    });
  }

  async save(creditScoreHistory: CreditScoreHistory): Promise<void> {
    await this.repo.save(creditScoreHistory);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
