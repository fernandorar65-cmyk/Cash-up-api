import { Injectable } from '@nestjs/common';
import { CollectionActionRepositoryPort } from '../../application/ports/collection-action.repository.port';

@Injectable()
export class CollectionActionRepository
  implements CollectionActionRepositoryPort
{
  async findById(): Promise<null> {
    return null;
  }
  async findByClientId(): Promise<[]> {
    return [];
  }
  async findByLoanId(): Promise<[]> {
    return [];
  }
  async save(): Promise<void> {}
}
