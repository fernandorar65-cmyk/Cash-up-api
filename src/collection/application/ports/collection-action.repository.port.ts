import { CollectionAction } from '../../domain/entities/collection-action.entity';

export const COLLECTION_ACTION_REPOSITORY = Symbol(
  'CollectionActionRepository',
);

export interface CollectionActionRepositoryPort {
  findById(id: string): Promise<CollectionAction | null>;
  findByClientId(clientId: string): Promise<CollectionAction[]>;
  findByLoanId(loanId: string): Promise<CollectionAction[]>;
  save(collectionAction: CollectionAction): Promise<void>;
  delete(id: string): Promise<void>;
}
