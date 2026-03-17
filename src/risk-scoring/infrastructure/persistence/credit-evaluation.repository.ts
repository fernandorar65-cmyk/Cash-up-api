import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditEvaluation } from '../../domain/entities/credit-evaluation.entity';
import type { CreditEvaluationRepositoryPort } from '../../application/ports/credit-evaluation.repository.port';

@Injectable()
export class CreditEvaluationRepository implements CreditEvaluationRepositoryPort {
  constructor(
    @InjectRepository(CreditEvaluation)
    private readonly repo: Repository<CreditEvaluation>,
  ) {}

  async findById(id: string): Promise<CreditEvaluation | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByClientId(clientId: string): Promise<CreditEvaluation[]> {
    return this.repo.find({
      where: { clientId },
      order: { evaluatedAt: 'DESC' },
    });
  }

  async save(creditEvaluation: CreditEvaluation): Promise<void> {
    await this.repo.save(creditEvaluation);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
