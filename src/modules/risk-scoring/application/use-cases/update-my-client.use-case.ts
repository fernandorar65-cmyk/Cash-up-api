import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CLIENT_REPOSITORY } from '../ports/client.repository.port';
import type { ClientRepositoryPort } from '../ports/client.repository.port';

export interface UpdateMyClientCommand {
  userId: string;
  name?: string;
  email?: string | null;
  phone?: string | null;
  monthlyIncome?: number;
}

@Injectable()
export class UpdateMyClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY) private readonly clientRepo: ClientRepositoryPort,
  ) {}

  async execute(cmd: UpdateMyClientCommand) {
    const client = await this.clientRepo.findByUserId(cmd.userId);
    if (!client) {
      throw new NotFoundException('No tienes perfil de cliente.');
    }

    if (cmd.name !== undefined) client.name = cmd.name;
    if (cmd.email !== undefined) client.email = cmd.email;
    if (cmd.phone !== undefined) client.phone = cmd.phone;
    if (cmd.monthlyIncome !== undefined) client.monthlyIncome = cmd.monthlyIncome;

    await this.clientRepo.save(client);
    return client;
  }
}

