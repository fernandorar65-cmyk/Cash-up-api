import { Inject, Injectable } from '@nestjs/common';
import { CollectionAction } from '../../domain/entities/collection-action.entity';
import { COLLECTION_ACTION_REPOSITORY } from '../ports/collection-action.repository.port';
import type { CollectionActionRepositoryPort } from '../ports/collection-action.repository.port';

@Injectable()
export class ListCollectionActionsByLoanUseCase {
  constructor(
    @Inject(COLLECTION_ACTION_REPOSITORY)
    private readonly collectionActionRepo: CollectionActionRepositoryPort,
  ) {}

  async execute(loanId: string): Promise<CollectionAction[]> {
    return this.collectionActionRepo.findByLoanId(loanId);
  }
}
