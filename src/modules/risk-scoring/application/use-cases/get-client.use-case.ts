import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Client } from '../../domain/entities/client.entity';
import { CLIENT_REPOSITORY } from '../ports/client.repository.port';
import type { ClientRepositoryPort } from '../ports/client.repository.port';

@Injectable()
export class GetClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY) private readonly clientRepo: ClientRepositoryPort,
  ) {}

  async execute(clientId: string): Promise<Client> {
    const client = await this.clientRepo.findById(clientId);
    if (!client) {
      throw new NotFoundException(`Cliente con id ${clientId} no encontrado`);
    }
    return client;
  }
}

