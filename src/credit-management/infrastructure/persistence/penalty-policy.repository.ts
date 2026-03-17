import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PenaltyPolicy } from '../../domain/entities/penalty-policy.entity';
import type { PenaltyPolicyRepositoryPort } from '../../application/ports/penalty-policy.repository.port';

@Injectable()
export class PenaltyPolicyRepository implements PenaltyPolicyRepositoryPort {
  constructor(
    @InjectRepository(PenaltyPolicy)
    private readonly repo: Repository<PenaltyPolicy>,
  ) {}

  async findById(id: string): Promise<PenaltyPolicy | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findAllActive(): Promise<PenaltyPolicy[]> {
    return this.repo.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async save(penaltyPolicy: PenaltyPolicy): Promise<void> {
    await this.repo.save(penaltyPolicy);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
