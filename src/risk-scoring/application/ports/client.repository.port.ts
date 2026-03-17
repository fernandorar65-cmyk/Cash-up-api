import { Client } from '../../domain/entities/client.entity';

export const CLIENT_REPOSITORY = Symbol('ClientRepository');

export interface ClientRepositoryPort {
  findById(id: string): Promise<Client | null>;
  findByUserId(userId: string): Promise<Client | null>;
  findByDocument(documentType: string, documentNumber: string): Promise<Client | null>;
  save(client: Client): Promise<void>;
  delete(id: string): Promise<void>;
}
