import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CollectionAction } from '../../domain/entities/collection-action.entity';
import { COLLECTION_ACTION_REPOSITORY } from '../ports/collection-action.repository.port';
import type { CollectionActionRepositoryPort } from '../ports/collection-action.repository.port';

@Injectable()
export class GetCollectionActionUseCase {
  constructor(
    @Inject(COLLECTION_ACTION_REPOSITORY)
    private readonly collectionActionRepo: CollectionActionRepositoryPort,
  ) {}

  async execute(id: string): Promise<CollectionAction> {
    const action = await this.collectionActionRepo.findById(id);
    if (!action) {
      throw new NotFoundException(
        `Gestión de cobranza con id ${id} no encontrada`,
      );
    }
    return action;
  }
}
