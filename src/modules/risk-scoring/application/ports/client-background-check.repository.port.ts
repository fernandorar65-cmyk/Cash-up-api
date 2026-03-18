import { ClientBackgroundCheck } from '../../domain/entities/client-background-check.entity';

export const CLIENT_BACKGROUND_CHECK_REPOSITORY = Symbol(
  'ClientBackgroundCheckRepository',
);

export interface ClientBackgroundCheckRepositoryPort {
  findById(id: string): Promise<ClientBackgroundCheck | null>;
  findByClientId(clientId: string): Promise<ClientBackgroundCheck[]>;
  save(clientBackgroundCheck: ClientBackgroundCheck): Promise<void>;
  delete(id: string): Promise<void>;
}

