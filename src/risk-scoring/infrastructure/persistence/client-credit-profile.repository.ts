import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientCreditProfile } from '../../domain/entities/client-credit-profile.entity';
import type { ClientCreditProfileRepositoryPort } from '../../application/ports/client-credit-profile.repository.port';

@Injectable()
export class ClientCreditProfileRepository
  implements ClientCreditProfileRepositoryPort
{
  constructor(
    @InjectRepository(ClientCreditProfile)
    private readonly repo: Repository<ClientCreditProfile>,
  ) {}

  async findById(id: string): Promise<ClientCreditProfile | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByClientId(
    clientId: string,
  ): Promise<ClientCreditProfile | null> {
    return this.repo.findOne({ where: { clientId } });
  }

  async save(clientCreditProfile: ClientCreditProfile): Promise<void> {
    await this.repo.save(clientCreditProfile);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
