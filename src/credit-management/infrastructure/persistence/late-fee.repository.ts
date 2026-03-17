import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LateFee } from '../../domain/entities/late-fee.entity';
import type { LateFeeRepositoryPort } from '../../application/ports/late-fee.repository.port';

@Injectable()
export class LateFeeRepository implements LateFeeRepositoryPort {
  constructor(
    @InjectRepository(LateFee)
    private readonly repo: Repository<LateFee>,
  ) {}

  async findById(id: string): Promise<LateFee | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByInstallmentId(installmentId: string): Promise<LateFee[]> {
    return this.repo.find({
      where: { installmentId },
      order: { appliedAt: 'ASC' },
    });
  }

  async save(lateFee: LateFee): Promise<void> {
    await this.repo.save(lateFee);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
