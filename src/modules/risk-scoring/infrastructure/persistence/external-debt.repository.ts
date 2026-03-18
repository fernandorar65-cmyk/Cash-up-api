import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExternalDebt } from '../../domain/entities/external-debt.entity';
import type { ExternalDebtRepositoryPort } from '../../application/ports/external-debt.repository.port';

@Injectable()
export class ExternalDebtRepository implements ExternalDebtRepositoryPort {
  constructor(
    @InjectRepository(ExternalDebt)
    private readonly repo: Repository<ExternalDebt>,
  ) {}

  async findById(id: string): Promise<ExternalDebt | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByClientId(clientId: string): Promise<ExternalDebt[]> {
    return this.repo.find({
      where: { clientId },
      order: { recordedAt: 'DESC' },
    });
  }

  async save(externalDebt: ExternalDebt): Promise<void> {
    await this.repo.save(externalDebt);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}

