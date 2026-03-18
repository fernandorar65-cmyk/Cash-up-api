import type { CreditRequest } from '../entities/credit-request';
import type { CreditRequestStatus } from '../enums/credit-request-status.enum';

export interface ICreditRequestRepository {
  findById(id: string): Promise<CreditRequest | null>;
  findByClientId(clientId: string): Promise<CreditRequest[]>;
  findByStatuses(statuses: CreditRequestStatus[]): Promise<CreditRequest[]>;
  findActivePendingByClientId(clientId: string): Promise<CreditRequest | null>;
  save(req: CreditRequest): Promise<void>;
}

