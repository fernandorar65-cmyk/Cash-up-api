import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../domain/entities/client.entity';
import type { ClientRepositoryPort } from '../../application/ports/client.repository.port';

@Injectable()
export class ClientRepository implements ClientRepositoryPort {
  constructor(
    @InjectRepository(Client)
    private readonly repo: Repository<Client>,
  ) {}

  async findById(id: string): Promise<Client | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Client | null> {
    return this.repo.findOne({ where: { userId } });
  }

  async findByDocument(
    documentType: string,
    documentNumber: string,
  ): Promise<Client | null> {
    return this.repo.findOne({
      where: { documentType, documentNumber },
    });
  }

  async save(client: Client): Promise<void> {
    await this.repo.save(client);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
