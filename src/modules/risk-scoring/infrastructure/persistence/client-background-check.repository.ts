import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientBackgroundCheck } from '../../domain/entities/client-background-check.entity';
import type { ClientBackgroundCheckRepositoryPort } from '../../application/ports/client-background-check.repository.port';

@Injectable()
export class ClientBackgroundCheckRepository
  implements ClientBackgroundCheckRepositoryPort
{
  constructor(
    @InjectRepository(ClientBackgroundCheck)
    private readonly repo: Repository<ClientBackgroundCheck>,
  ) {}

  async findById(id: string): Promise<ClientBackgroundCheck | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByClientId(clientId: string): Promise<ClientBackgroundCheck[]> {
    return this.repo.find({
      where: { clientId },
      order: { checkedAt: 'DESC' },
    });
  }

  async save(clientBackgroundCheck: ClientBackgroundCheck): Promise<void> {
    await this.repo.save(clientBackgroundCheck);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}

