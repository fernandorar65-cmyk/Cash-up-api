import { Injectable } from '@nestjs/common';
import { ClientCreditProfileRepositoryPort } from '../../application/ports/client-credit-profile.repository.port';

@Injectable()
export class ClientCreditProfileRepository
  implements ClientCreditProfileRepositoryPort
{
  async findById(): Promise<null> {
    return null;
  }
  async findByClientId(): Promise<null> {
    return null;
  }
  async save(): Promise<void> {}
}
