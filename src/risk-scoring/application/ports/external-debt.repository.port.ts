import { ExternalDebt } from '../../domain/entities/external-debt.entity';

export const EXTERNAL_DEBT_REPOSITORY = Symbol('ExternalDebtRepository');

export interface ExternalDebtRepositoryPort {
  findById(id: string): Promise<ExternalDebt | null>;
  findByClientId(clientId: string): Promise<ExternalDebt[]>;
  save(externalDebt: ExternalDebt): Promise<void>;
}
