import { Injectable } from '@nestjs/common';
import { ClientRepositoryPort } from '../../application/ports/client.repository.port';

@Injectable()
export class ClientRepository implements ClientRepositoryPort {
  async findById(): Promise<null> {
    return null;
  }
  async findByDocument(): Promise<null> {
    return null;
  }
  async save(): Promise<void> {}
}
