import { Inject, Injectable } from '@nestjs/common';
import { CollectionAction } from '../../domain/entities/collection-action.entity';
import { COLLECTION_ACTION_REPOSITORY } from '../ports/collection-action.repository.port';
import type { CollectionActionRepositoryPort } from '../ports/collection-action.repository.port';

@Injectable()
export class ListCollectionActionsByClientUseCase {
  constructor(
    @Inject(COLLECTION_ACTION_REPOSITORY)
    private readonly collectionActionRepo: CollectionActionRepositoryPort,
  ) {}

  async execute(clientId: string): Promise<CollectionAction[]> {
    return this.collectionActionRepo.findByClientId(clientId);
  }
}
