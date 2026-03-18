import { CreditRequest } from '../../domain/entities/credit-request.entity';

export const CREDIT_REQUEST_REPOSITORY = Symbol('CreditRequestRepository');

export interface CreditRequestRepositoryPort {
  findById(id: string): Promise<CreditRequest | null>;
  findByClientId(clientId: string): Promise<CreditRequest[]>;
  /** Solicitudes abiertas (pendiente de decisión) */
  findActivePendingByClientId(clientId: string): Promise<CreditRequest | null>;
  findByStatuses(statuses: string[]): Promise<CreditRequest[]>;
  save(creditRequest: CreditRequest): Promise<void>;
}
