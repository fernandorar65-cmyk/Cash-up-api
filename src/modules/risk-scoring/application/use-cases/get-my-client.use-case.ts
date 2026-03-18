import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CLIENT_REPOSITORY } from '../ports/client.repository.port';
import type { ClientRepositoryPort } from '../ports/client.repository.port';

@Injectable()
export class GetMyClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY) private readonly clientRepo: ClientRepositoryPort,
  ) {}

  async execute(userId: string) {
    const client = await this.clientRepo.findByUserId(userId);
    if (!client) {
      throw new NotFoundException('No tienes perfil de cliente.');
    }
    return client;
  }
}

