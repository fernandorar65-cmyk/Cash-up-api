import { Injectable } from '@nestjs/common';
import { ClientBackgroundCheckRepositoryPort } from '../../application/ports/client-background-check.repository.port';

@Injectable()
export class ClientBackgroundCheckRepository
  implements ClientBackgroundCheckRepositoryPort
{
  async findById(): Promise<null> {
    return null;
  }
  async findByClientId(): Promise<[]> {
    return [];
  }
  async save(): Promise<void> {}
}
