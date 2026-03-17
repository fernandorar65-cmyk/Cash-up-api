import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionAction } from '../../domain/entities/collection-action.entity';
import type { CollectionActionRepositoryPort } from '../../application/ports/collection-action.repository.port';

@Injectable()
export class CollectionActionRepository
  implements CollectionActionRepositoryPort
{
  constructor(
    @InjectRepository(CollectionAction)
    private readonly repo: Repository<CollectionAction>,
  ) {}

  async findById(id: string): Promise<CollectionAction | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByClientId(clientId: string): Promise<CollectionAction[]> {
    return this.repo.find({
      where: { clientId },
      order: { performedAt: 'DESC' },
    });
  }

  async findByLoanId(loanId: string): Promise<CollectionAction[]> {
    return this.repo.find({
      where: { loanId },
      order: { performedAt: 'DESC' },
    });
  }

  async save(collectionAction: CollectionAction): Promise<void> {
    await this.repo.save(collectionAction);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
