import { Injectable } from '@nestjs/common';
import { ExternalDebtRepositoryPort } from '../../application/ports/external-debt.repository.port';

@Injectable()
export class ExternalDebtRepository implements ExternalDebtRepositoryPort {
  async findById(): Promise<null> {
    return null;
  }
  async findByClientId(): Promise<[]> {
    return [];
  }
  async save(): Promise<void> {}
}
