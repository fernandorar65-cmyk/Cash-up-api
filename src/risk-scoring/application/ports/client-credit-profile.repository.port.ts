import { ClientCreditProfile } from '../../domain/entities/client-credit-profile.entity';

export const CLIENT_CREDIT_PROFILE_REPOSITORY = Symbol(
  'ClientCreditProfileRepository',
);

export interface ClientCreditProfileRepositoryPort {
  findById(id: string): Promise<ClientCreditProfile | null>;
  findByClientId(clientId: string): Promise<ClientCreditProfile | null>;
  save(clientCreditProfile: ClientCreditProfile): Promise<void>;
}
